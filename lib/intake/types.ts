export type PatientStatus = "inactive" | "active" | "submitted";

export type IntakeConnectionState =
  | "connecting"
  | "connected"
  | "disconnected";

export type IntakeRealtimeTransport = "supabase" | "local";

export type PatientIntakeField =
  | "firstName"
  | "middleName"
  | "lastName"
  | "dateOfBirth"
  | "gender"
  | "phoneNumber"
  | "email"
  | "address"
  | "preferredLanguage"
  | "nationality"
  | "emergencyContactName"
  | "emergencyContactRelationship"
  | "religion";

export type PatientIntake = Record<PatientIntakeField, string>;

export type IntakeFieldKind =
  | "text"
  | "date"
  | "email"
  | "tel"
  | "textarea"
  | "select";

export type IntakeFieldSection =
  | "personal"
  | "contact"
  | "background"
  | "emergency";

export type IntakeFieldDefinition = {
  name: PatientIntakeField;
  label: string;
  required: boolean;
  kind: IntakeFieldKind;
  section: IntakeFieldSection;
  placeholder?: string;
  options?: string[];
};

export type IntakeRealtimeEvent =
  | {
      type: "field:update";
      field: PatientIntakeField;
      value: string;
      updatedAt: string;
    }
  | {
      type: "status:update";
      status: PatientStatus;
      updatedAt: string;
    }
  | {
      type: "form:replace";
      data: PatientIntake;
      status: PatientStatus;
      updatedAt: string;
    };

export type IntakeValidationErrors = Partial<
  Record<PatientIntakeField, string>
>;
