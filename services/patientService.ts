import { PATIENT_DATABASE } from '../constants';
import { Patient } from '../types';

/**
 * Verifies a patient's identity against the static database.
 * Normalizes input for case-insensitivity and postcode formatting.
 * @param input - Partial patient details for verification.
 * @returns The full Patient object if verified, otherwise null.
 */
export const verifyPatient = (input: Partial<Patient>): Patient | null => {
  const normalizedInput = {
    first_name: input.first_name?.toLowerCase(),
    last_name: input.last_name?.toLowerCase(),
    age: input.age,
    postcode: input.postcode?.toUpperCase().replace(/\s/g, ''), // Normalize postcode
  };

  const foundPatient = PATIENT_DATABASE.find(p =>
    p.first_name.toLowerCase() === normalizedInput.first_name &&
    p.last_name.toLowerCase() === normalizedInput.last_name &&
    p.age === normalizedInput.age &&
    p.postcode.toUpperCase().replace(/\s/g, '') === normalizedInput.postcode
  );

  return foundPatient || null;
};
