import type {
  IntakeFieldDefinition,
  IntakeFieldSection,
  PatientIntake,
} from "./types";

export const intakeSections: Record<IntakeFieldSection, string> = {
  personal: "Personal details",
  contact: "Contact details",
  background: "Background details",
  emergency: "Emergency contact",
};

export const intakeFields: IntakeFieldDefinition[] = [
  {
    name: "firstName",
    label: "First Name",
    required: true,
    kind: "text",
    section: "personal",
    placeholder: "Enter first name",
  },
  {
    name: "middleName",
    label: "Middle Name",
    required: false,
    kind: "text",
    section: "personal",
    placeholder: "Enter middle name",
  },
  {
    name: "lastName",
    label: "Last Name",
    required: true,
    kind: "text",
    section: "personal",
    placeholder: "Enter last name",
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    required: true,
    kind: "date",
    section: "personal",
  },
  {
    name: "gender",
    label: "Gender",
    required: true,
    kind: "select",
    section: "personal",
    options: ["Female", "Male", "Non-binary", "Prefer not to say"],
  },
  {
    name: "phoneNumber",
    label: "Phone Number",
    required: true,
    kind: "tel",
    section: "contact",
    placeholder: "Enter phone number",
  },
  {
    name: "email",
    label: "Email",
    required: true,
    kind: "email",
    section: "contact",
    placeholder: "name@example.com",
  },
  {
    name: "address",
    label: "Address",
    required: true,
    kind: "textarea",
    section: "contact",
    placeholder: "Enter current address",
  },
  {
    name: "preferredLanguage",
    label: "Preferred Language",
    required: true,
    kind: "text",
    section: "background",
    placeholder: "Enter preferred language",
  },
  {
    name: "nationality",
    label: "Nationality",
    required: true,
    kind: "text",
    section: "background",
    placeholder: "Enter nationality",
  },
  {
    name: "religion",
    label: "Religion",
    required: false,
    kind: "text",
    section: "background",
    placeholder: "Enter religion",
  },
  {
    name: "emergencyContactName",
    label: "Emergency Contact Name",
    required: false,
    kind: "text",
    section: "emergency",
    placeholder: "Enter contact name",
  },
  {
    name: "emergencyContactRelationship",
    label: "Emergency Contact Relationship",
    required: false,
    kind: "text",
    section: "emergency",
    placeholder: "Enter relationship",
  },
];

export const emptyPatientIntake: PatientIntake = intakeFields.reduce(
  (data, field) => ({
    ...data,
    [field.name]: "",
  }),
  {} as PatientIntake,
);

export const requiredIntakeFields = intakeFields.filter(
  (field) => field.required,
);
