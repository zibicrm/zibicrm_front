import { http } from "./httpServices";

export function getEventByDataService(header) {
  return http.get("supplier/today/event", { headers: header });
}
export function getAppointmentTodayService(data, header) {
  return http.post("supplier/today/appointment", data, { headers: header });
}
export function getAppointmentSurgeryTodayService(data, header) {
  return http.post("supplier/today/appointment/surgery", data, {
    headers: header,
  });
}
export function getAppointmentUserService(data, header) {
  return http.post("supplier/appointment", data, { headers: header });
}

export function getAppointmentSurgeryUserService(data, header) {
  return http.post("supplier/appointment/surgery", data, { headers: header });
}
export function getAppointmentByDateService(data, header) {
  return http.post("supplier/appointment/date", data, { headers: header });
}
export function getAppointmentSurgeryByDateService(data, header) {
  return http.post("supplier/appointment/surgery/date", data, {
    headers: header,
  });
}

export function getDoneFollowUpEventService(id, header) {
  return http.get(`supplier/set/today/event/${id}`, { headers: header });
}
