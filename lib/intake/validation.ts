import { z } from "zod";
import type {
  IntakeValidationErrors,
  PatientIntake,
  PatientIntakeField,
} from "./types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
const genderOptions = new Set([
  "Female",
  "Male",
  "Non-binary",
  "Prefer not to say",
]);

const maxLengths: Record<PatientIntakeField, number> = {
  firstName: 100,
  middleName: 100,
  lastName: 100,
  dateOfBirth: 10,
  gender: 32,
  phoneNumber: 32,
  email: 254,
  address: 500,
  preferredLanguage: 100,
  nationality: 100,
  emergencyContactName: 100,
  emergencyContactRelationship: 100,
  religion: 100,
};

function requiredText(
  label: string,
  maxLength: number,
): z.ZodString {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`);
}

function optionalText(label: string, maxLength: number): z.ZodString {
  return z
    .string()
    .trim()
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`);
}

function isValidCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isFutureDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  return date > today;
}

const dateOfBirthSchema = requiredText(
  "Date of Birth",
  maxLengths.dateOfBirth,
).superRefine((value, context) => {
  if (!value) {
    return;
  }

  if (!isValidCalendarDate(value)) {
    context.addIssue({
      code: "custom",
      message: "Enter a valid date of birth.",
    });
    return;
  }

  if (isFutureDate(value)) {
    context.addIssue({
      code: "custom",
      message: "Date of birth cannot be in the future.",
    });
  }
});

export const patientIntakeFieldSchemas = {
  firstName: requiredText("First Name", maxLengths.firstName),
  middleName: optionalText("Middle Name", maxLengths.middleName),
  lastName: requiredText("Last Name", maxLengths.lastName),
  dateOfBirth: dateOfBirthSchema,
  gender: requiredText("Gender", maxLengths.gender).refine(
    (value) => !value || genderOptions.has(value),
    "Select a valid gender.",
  ),
  phoneNumber: requiredText(
    "Phone Number",
    maxLengths.phoneNumber,
  ).refine((value) => {
    if (!value) {
      return true;
    }

    const digitCount = value.replace(/\D/g, "").length;

    return (
      phonePattern.test(value) &&
      digitCount >= 7 &&
      digitCount <= 15
    );
  }, "Enter a valid phone number."),
  email: requiredText("Email", maxLengths.email).refine(
    (value) => !value || emailPattern.test(value),
    "Enter a valid email address.",
  ),
  address: requiredText("Address", maxLengths.address),
  preferredLanguage: requiredText(
    "Preferred Language",
    maxLengths.preferredLanguage,
  ),
  nationality: requiredText("Nationality", maxLengths.nationality),
  emergencyContactName: optionalText(
    "Emergency Contact Name",
    maxLengths.emergencyContactName,
  ),
  emergencyContactRelationship: optionalText(
    "Emergency Contact Relationship",
    maxLengths.emergencyContactRelationship,
  ),
  religion: optionalText("Religion", maxLengths.religion),
} satisfies Record<PatientIntakeField, z.ZodType<string>>;

export const patientIntakeSchema: z.ZodType<PatientIntake> = z
  .object(patientIntakeFieldSchemas)
  .strict();

const wireValue = (field: PatientIntakeField) =>
  z.string().max(maxLengths[field]);

export const patientIntakeWireSchema: z.ZodType<PatientIntake> = z
  .object({
    firstName: wireValue("firstName"),
    middleName: wireValue("middleName"),
    lastName: wireValue("lastName"),
    dateOfBirth: wireValue("dateOfBirth"),
    gender: wireValue("gender"),
    phoneNumber: wireValue("phoneNumber"),
    email: wireValue("email"),
    address: wireValue("address"),
    preferredLanguage: wireValue("preferredLanguage"),
    nationality: wireValue("nationality"),
    emergencyContactName: wireValue("emergencyContactName"),
    emergencyContactRelationship: wireValue(
      "emergencyContactRelationship",
    ),
    religion: wireValue("religion"),
  })
  .strict();

function getValidationErrors(
  issues: z.core.$ZodIssue[],
): IntakeValidationErrors {
  return issues.reduce<IntakeValidationErrors>((errors, issue) => {
    const field = issue.path[0];

    if (
      typeof field === "string" &&
      field in patientIntakeFieldSchemas &&
      !errors[field as PatientIntakeField]
    ) {
      errors[field as PatientIntakeField] = issue.message;
    }

    return errors;
  }, {});
}

export function validateIntakeField(
  field: PatientIntakeField,
  value: string,
): string | undefined {
  const result = patientIntakeFieldSchemas[field].safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
}

export function validatePatientIntake(
  data: PatientIntake,
): IntakeValidationErrors {
  const result = patientIntakeSchema.safeParse(data);

  return result.success ? {} : getValidationErrors(result.error.issues);
}

export function parsePatientIntake(value: unknown): PatientIntake | null {
  const result = patientIntakeSchema.safeParse(value);

  return result.success ? result.data : null;
}

export function isPatientIntakeValid(data: PatientIntake): boolean {
  return patientIntakeSchema.safeParse(data).success;
}
