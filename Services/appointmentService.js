import { http } from "./httpServices";

export function setNewReserveVisit(data, header) {
  return http.post(`appointment/set/reserve`, data, { headers: header });
}
export function getDateTableVisit(data, header) {
  return http.post("appointment/get/date/table", data, { headers: header });
}
export function getTimeTableVisit(data, header) {
  return http.post("appointment/get/time/table", data, { headers: header });
}
export function getAllAppointmentService(data, header) {
  return http.post("appointment/all", data, { headers: header });
}
export function cancelAppointmentService(data, header) {
  return http.post("appointment/visit/cancel", data, { headers: header });
}
export function searchAppointmentService(data, header) {
  return http.post("appointment/search", data, { headers: header });
}
export function setNewReserveVisitVip(data, header) {
  return http.post(`appointment/set/reserve/vip`, data, { headers: header });
}
export function sendMessageAppointment(data, header) {
  return http.post(`appointment/message/resend`, data, { headers: header });
}
export function sendRemindMessageAppointment(data, header) {
  return http.post(`appointment/message/remind`, data, { headers: header });
}
export function seacrhAppointment(data, header) {
  return http.post(`appointment/search`, data, { headers: header });
}
