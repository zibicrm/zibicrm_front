import { http } from "./httpServices";

export function setNewReserveSurgery(data, header) {
  return http.post(`appointment/surgery/set/reserve`, data, {
    headers: header,
  });
}
export function getDateTableSurgery(data, header) {
  return http.post("appointment/surgery/get/date/table", data, {
    headers: header,
  });
}
export function getTimeTableSurgery(data, header) {
  return http.post("appointment/surgery/get/time/table", data, {
    headers: header,
  });
}
export function getAllAppointmentSurgeryService(data, header) {
  return http.post("appointment/surgery/all", data, { headers: header });
}
export function cancelAppointmentSurgeryService(data, header) {
  return http.post("appointment/surgery/cancel", data, { headers: header });
}
export function searchAppointmentSurgeryService(data, header) {
  return http.post("appointment/surgery/search", data, { headers: header });
}
export function setNewReserveSurgeryVip(data, header) {
  return http.post(`appointment/surgery/set/reserve/vip`, data, {
    headers: header,
  });
}
export function sendMessageAppointmentSurgery(data, header) {
  return http.post(`appointment/surgery/message/resend`, data, {
    headers: header,
  });
}
export function sendRemindMessageAppointmentSurgery(data, header) {
  return http.post(`appointment/surgery/message/remind`, data, {
    headers: header,
  });
}
export function seacrhAppointmentSurgery(data, header) {
  return http.post(`appointment/surgery/search`, data, { headers: header });
}
