import { http } from "./httpServices";

export function sendClinicAddressService(data, header) {
  return http.post("message/send/clinic", data, { headers: header });
}
export function sendMessagePriceService(data, header) {
  return http.post("message/sendMessage/price", data, { headers: header });
}
export function getRecivedMessageService(data, header) {
  return http.post("message/receive", data, { headers: header });
}
export function getConversationService(data, header) {
  return http.post(`message/get/conversation`, data, { headers: header });
}
export function answerMessageService(data, header) {
  return http.post(`message/answer`, data, { headers: header });
}
export function searchMessageService(data, header) {
  return http.post("message/search", data, { headers: header });
}
export function ReadMessageService(data, header) {
  return http.post("message/set/read", data, { headers: header });
}
export function getUnreadMessageService( header) {
  return http.get("message/unread",  { headers: header });
}
