import { http } from "./httpServices";

export function getBaleConversationService(data, header) {
  return http.post(`bale/conversation/list`, data, { headers: header });
}
export function getBaleSingleConversationService(data, header) {
  return http.post(`bale/conversation/message`, data, { headers: header });
}
export function getBaleRequestService(header) {
  return http.get(`bale/conversation/request/list`, { headers: header });
}
export function getBaleStatistics(header) {
  return http.get(`bale/conversation/statistics`, { headers: header });
}

export function getBaleAminConversationService(data, header) {
  return http.post(`bale/conversation/new`, data, { headers: header });
}
export function baleAssignToUser(data, header) {
  return http.post(`bale/conversation/assign`, data, { headers: header });
}
export function baleAssignToUserService(data, header) {
  return http.post(`bale/conversation/request/assign`, data, {
    headers: header,
  });
}

export function baleDeleteConversation(data, header) {
  return http.post(`bale/conversation/delete`, data, { headers: header });
}
export function baleRejectConversation(data, header) {
  return http.post(`bale/conversation/reject`, data, { headers: header });
}
export function baleChangeConversationToRead(data, header) {
  return http.post(`bale/conversation/read`, data, { headers: header });
}
export function baleSendMessageService(data, header) {
  return http.post(`bale/conversation/send`, data, { headers: header });
}
export function baleNotificationService(header) {
  return http.get(`bale/conversation/notification`, { headers: header });
}

export function baleChangeConversationToFinishService(data, header) {
  return http.post(`bale/conversation/finish`, data, { headers: header });
}
export function baleReportMessageService(data, header) {
  return http.post(`bale/conversation/report`, data, { headers: header });
}
export function baleGetSupplierReports(data, header) {
  return http.post(`bale/conversation/supplier/report`, data, {
    headers: header,
  });
}
export function baleDeleteMessage(data, header) {
  return http.post(`bale/conversation/message/delete`, data, { headers: header });
}
export function baleSendImageService(data, header) {
  return http.post(`bale/conversation/image/send`, data, { headers: header });
}
