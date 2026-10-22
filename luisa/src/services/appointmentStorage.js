export const APPOINTMENTS_STORAGE_KEY = "rtual-appointments";

export function readAppointments() {
  const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
  return storedAppointments ? JSON.parse(storedAppointments) : [];
}

export function saveAppointments(appointments) {
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  window.dispatchEvent(new Event("rtual-appointments-updated"));
}
