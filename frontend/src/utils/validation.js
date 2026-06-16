export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isEmailIdentifier(identifier) {
  return identifier.includes("@");
}

export function firstNonEmpty(values = []) {
  return values.some((value) => String(value || "").trim() !== "");
}
