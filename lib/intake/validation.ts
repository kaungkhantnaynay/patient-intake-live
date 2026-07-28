import { intakeFields } from "./schema";
import type {
  IntakeValidationErrors,
  PatientIntake,
  PatientIntakeField,
} from "./types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export function validateIntakeField(
  field: PatientIntakeField,
  value: string,
): string | undefined {
  const definition = intakeFields.find((item) => item.name === field);
  const trimmedValue = value.trim();

  if (!definition) {
    return undefined;
  }

  if (definition.required && !trimmedValue) {
    return `${definition.label} is required.`;
  }

  if (!trimmedValue) {
    return undefined;
  }

  if (field === "email" && !emailPattern.test(trimmedValue)) {
    return "Enter a valid email address.";
  }

  if (field === "phoneNumber" && !phonePattern.test(trimmedValue)) {
    return "Enter a valid phone number.";
  }

  if (field === "dateOfBirth") {
    const date = new Date(`${trimmedValue}T00:00:00`);
    const today = new Date();

    if (Number.isNaN(date.getTime())) {
      return "Enter a valid date of birth.";
    }

    if (date > today) {
      return "Date of birth cannot be in the future.";
    }
  }

  return undefined;
}

export function validatePatientIntake(
  data: PatientIntake,
): IntakeValidationErrors {
  return intakeFields.reduce<IntakeValidationErrors>((errors, field) => {
    const error = validateIntakeField(field.name, data[field.name] ?? "");

    if (error) {
      errors[field.name] = error;
    }

    return errors;
  }, {});
}

export function isPatientIntakeValid(data: PatientIntake): boolean {
  return Object.keys(validatePatientIntake(data)).length === 0;
}
