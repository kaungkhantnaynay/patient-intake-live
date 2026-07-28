import { z } from "zod";
import { emptyPatientIntake, intakeFields } from "./schema";
import { getSupabaseBrowserClient } from "./supabase";
import {
  patientIntakeSchema,
  patientIntakeWireSchema,
} from "./validation";
import type {
  IntakeConnectionState,
  IntakeRealtimeEvent,
  IntakeRealtimeTransport,
  PatientIntakeField,
} from "./types";

const channelTopic = "patient-intake:demo";
const localChannelTopic = "agnos-patient-intake-demo-v1";
const snapshotRequestEvent = "snapshot:request";

const intakeRealtimeEventNames = {
  fieldUpdate: "field:update",
  statusUpdate: "status:update",
  formReplace: "form:replace",
} as const;

const patientFields = new Set<PatientIntakeField>(
  intakeFields.map((field) => field.name),
);
const patientStatusSchema = z.enum([
  "inactive",
  "active",
  "submitted",
]);
const patientFieldSchema = z.custom<PatientIntakeField>(
  (value) =>
    typeof value === "string" &&
    patientFields.has(value as PatientIntakeField),
);
const timestampSchema = z.string().refine(
  (value) => !Number.isNaN(Date.parse(value)),
  "Invalid timestamp.",
);
const realtimeEventSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal(intakeRealtimeEventNames.fieldUpdate),
      field: patientFieldSchema,
      value: z.string().max(500),
      updatedAt: timestampSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal(intakeRealtimeEventNames.statusUpdate),
      status: patientStatusSchema,
      updatedAt: timestampSchema,
    })
    .strict(),
  z
    .object({
      type: z.literal(intakeRealtimeEventNames.formReplace),
      data: patientIntakeWireSchema,
      status: patientStatusSchema,
      updatedAt: timestampSchema,
    })
    .strict(),
]);
const realtimeEnvelopeSchema = z
  .object({
    event: z.union([
      z.literal(intakeRealtimeEventNames.fieldUpdate),
      z.literal(intakeRealtimeEventNames.statusUpdate),
      z.literal(intakeRealtimeEventNames.formReplace),
      z.literal(snapshotRequestEvent),
    ]),
    payload: z.unknown(),
  })
  .strict();

type RealtimeEventName =
  (typeof intakeRealtimeEventNames)[keyof typeof intakeRealtimeEventNames];

type RealtimeEnvelope = {
  event: RealtimeEventName | typeof snapshotRequestEvent;
  payload: unknown;
};

type IntakeSnapshotEvent = Extract<
  IntakeRealtimeEvent,
  { type: "form:replace" }
>;

let transientSnapshot: IntakeSnapshotEvent | null = null;

type CreateIntakeRealtimeConnectionOptions = {
  onConnectionChange: (
    state: IntakeConnectionState,
    transport: IntakeRealtimeTransport,
  ) => void;
  onEvent: (event: IntakeRealtimeEvent) => void;
  onSnapshotRequest?: () => void;
};

export type IntakeRealtimeConnection = {
  publish: (event: IntakeRealtimeEvent) => Promise<boolean>;
  requestSnapshot: () => Promise<boolean>;
  disconnect: () => void;
};

function rememberTransientSnapshot(event: IntakeRealtimeEvent) {
  if (event.type === intakeRealtimeEventNames.formReplace) {
    transientSnapshot = {
      ...event,
      data: { ...event.data },
    };
    return;
  }

  const currentSnapshot = transientSnapshot ?? {
    type: intakeRealtimeEventNames.formReplace,
    data: { ...emptyPatientIntake },
    status: "inactive",
    updatedAt: event.updatedAt,
  };

  transientSnapshot =
    event.type === intakeRealtimeEventNames.fieldUpdate
      ? {
          ...currentSnapshot,
          data: {
            ...currentSnapshot.data,
            [event.field]: event.value,
          },
          updatedAt: event.updatedAt,
        }
      : {
          ...currentSnapshot,
          status: event.status,
          updatedAt: event.updatedAt,
        };
}

export function getTransientIntakeSnapshot(): IntakeSnapshotEvent | null {
  if (!transientSnapshot) {
    return null;
  }

  return {
    ...transientSnapshot,
    data: { ...transientSnapshot.data },
  };
}

function parseRealtimeEvent(value: unknown): IntakeRealtimeEvent | null {
  const result = realtimeEventSchema.safeParse(value);

  if (!result.success) {
    return null;
  }

  if (
    result.data.type === intakeRealtimeEventNames.formReplace &&
    result.data.status === "submitted"
  ) {
    const submittedData = patientIntakeSchema.safeParse(result.data.data);

    if (!submittedData.success) {
      return null;
    }

    return {
      ...result.data,
      data: submittedData.data,
    };
  }

  return result.data as IntakeRealtimeEvent;
}

function createSupabaseConnection(
  client: NonNullable<ReturnType<typeof getSupabaseBrowserClient>>,
  options: CreateIntakeRealtimeConnectionOptions,
): IntakeRealtimeConnection {
  let closed = false;
  const channel = client.channel(channelTopic, {
    config: {
      broadcast: {
        ack: true,
        self: false,
      },
    },
  });

  function receiveEvent(payload: unknown) {
    const event = parseRealtimeEvent(payload);

    if (event) {
      options.onEvent(event);
    }
  }

  Object.values(intakeRealtimeEventNames).forEach((eventName) => {
    channel.on(
      "broadcast",
      { event: eventName },
      ({ payload }: { payload: unknown }) => receiveEvent(payload),
    );
  });

  channel.on("broadcast", { event: snapshotRequestEvent }, () => {
    options.onSnapshotRequest?.();
  });

  channel.subscribe((status) => {
    if (closed) {
      return;
    }

    if (status === "SUBSCRIBED") {
      options.onConnectionChange("connected", "supabase");
      return;
    }

    if (
      status === "CHANNEL_ERROR" ||
      status === "TIMED_OUT" ||
      status === "CLOSED"
    ) {
      options.onConnectionChange("disconnected", "supabase");
    }
  });

  async function send(event: string, payload: unknown) {
    if (closed) {
      return false;
    }

    try {
      const result = await channel.send({
        type: "broadcast",
        event,
        payload,
      });

      return result === "ok";
    } catch {
      options.onConnectionChange("disconnected", "supabase");
      return false;
    }
  }

  return {
    publish: (event) => send(event.type, event),
    requestSnapshot: () => send(snapshotRequestEvent, {}),
    disconnect: () => {
      closed = true;
      void client.removeChannel(channel);
    },
  };
}

function createLocalConnection(
  options: CreateIntakeRealtimeConnectionOptions,
): IntakeRealtimeConnection {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) {
    queueMicrotask(() => {
      options.onConnectionChange("disconnected", "local");
    });

    return {
      publish: async () => false,
      requestSnapshot: async () => false,
      disconnect: () => undefined,
    };
  }

  const channel = new BroadcastChannel(localChannelTopic);
  let closed = false;

  channel.addEventListener("message", (message: MessageEvent<unknown>) => {
    const result = realtimeEnvelopeSchema.safeParse(message.data);

    if (!result.success) {
      return;
    }

    const envelope = result.data as RealtimeEnvelope;

    if (envelope.event === snapshotRequestEvent) {
      options.onSnapshotRequest?.();
      return;
    }

    const event = parseRealtimeEvent(envelope.payload);

    if (event && event.type === envelope.event) {
      options.onEvent(event);
    }
  });

  queueMicrotask(() => {
    if (!closed) {
      options.onConnectionChange("connected", "local");
    }
  });

  function send(envelope: RealtimeEnvelope) {
    if (closed) {
      return false;
    }

    channel.postMessage(envelope);
    return true;
  }

  return {
    publish: async (event) =>
      send({
        event: event.type,
        payload: event,
      }),
    requestSnapshot: async () =>
      send({
        event: snapshotRequestEvent,
        payload: {},
      }),
    disconnect: () => {
      closed = true;
      channel.close();
    },
  };
}

export function createIntakeRealtimeConnection(
  options: CreateIntakeRealtimeConnectionOptions,
): IntakeRealtimeConnection {
  const connectionOptions: CreateIntakeRealtimeConnectionOptions = {
    ...options,
    onEvent: (event) => {
      rememberTransientSnapshot(event);
      options.onEvent(event);
    },
  };
  const supabase = getSupabaseBrowserClient();

  options.onConnectionChange(
    "connecting",
    supabase ? "supabase" : "local",
  );

  const connection = supabase
    ? createSupabaseConnection(supabase, connectionOptions)
    : createLocalConnection(connectionOptions);

  return {
    ...connection,
    publish: (event) => {
      const parsedEvent = parseRealtimeEvent(event);

      if (!parsedEvent) {
        return Promise.resolve(false);
      }

      rememberTransientSnapshot(parsedEvent);
      return connection.publish(parsedEvent);
    },
  };
}
