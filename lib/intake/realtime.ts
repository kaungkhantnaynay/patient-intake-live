import { emptyPatientIntake, intakeFields } from "./schema";
import { getSupabaseBrowserClient } from "./supabase";
import type {
  IntakeConnectionState,
  IntakeRealtimeEvent,
  IntakeRealtimeTransport,
  PatientIntake,
  PatientIntakeField,
  PatientStatus,
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
const patientStatuses = new Set<PatientStatus>([
  "inactive",
  "active",
  "submitted",
]);

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasValidTimestamp(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function parsePatientIntake(value: unknown): PatientIntake | null {
  if (!isRecord(value)) {
    return null;
  }

  const parsedData = {} as PatientIntake;

  for (const field of intakeFields) {
    const fieldValue = value[field.name];

    if (typeof fieldValue !== "string") {
      return null;
    }

    parsedData[field.name] = fieldValue;
  }

  return parsedData;
}

function parseRealtimeEvent(value: unknown): IntakeRealtimeEvent | null {
  if (!isRecord(value) || !hasValidTimestamp(value.updatedAt)) {
    return null;
  }

  if (
    value.type === intakeRealtimeEventNames.fieldUpdate &&
    typeof value.field === "string" &&
    patientFields.has(value.field as PatientIntakeField) &&
    typeof value.value === "string"
  ) {
    return {
      type: value.type,
      field: value.field as PatientIntakeField,
      value: value.value,
      updatedAt: value.updatedAt,
    };
  }

  if (
    value.type === intakeRealtimeEventNames.statusUpdate &&
    typeof value.status === "string" &&
    patientStatuses.has(value.status as PatientStatus)
  ) {
    return {
      type: value.type,
      status: value.status as PatientStatus,
      updatedAt: value.updatedAt,
    };
  }

  if (
    value.type === intakeRealtimeEventNames.formReplace &&
    typeof value.status === "string" &&
    patientStatuses.has(value.status as PatientStatus)
  ) {
    const data = parsePatientIntake(value.data);

    if (data) {
      return {
        type: value.type,
        data,
        status: value.status as PatientStatus,
        updatedAt: value.updatedAt,
      };
    }
  }

  return null;
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
    if (!isRecord(message.data) || typeof message.data.event !== "string") {
      return;
    }

    const envelope = message.data as RealtimeEnvelope;

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
      rememberTransientSnapshot(event);
      return connection.publish(event);
    },
  };
}
