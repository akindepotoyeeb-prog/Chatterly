export function profileName(user) {
  return user?.name || user?.fullName || user?.username || "";
}
export function profilePayload(form) {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    about: form.about.trim(),
  };
}
