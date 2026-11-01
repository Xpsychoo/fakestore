import type { Address } from "./types";

export type AddressErrors = Partial<Record<keyof Address, string>>;

export const EMPTY_ADDRESS: Address = { name: "", email: "", phone: "", street: "", city: "", zip: "" };

export function validateAddress(a: Address): AddressErrors {
  const errors: AddressErrors = {};
  if (a.name.trim().length < 2) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim())) errors.email = "Enter a valid email address.";
  if (a.phone.replace(/\D/g, "").length < 7) errors.phone = "Enter a phone number with at least 7 digits.";
  if (a.street.trim().length < 3) errors.street = "Enter your street address.";
  if (a.city.trim().length < 2) errors.city = "Enter your city.";
  if (!/^[A-Za-z0-9 -]{3,10}$/.test(a.zip.trim())) errors.zip = "Enter a valid postal code.";
  return errors;
}
