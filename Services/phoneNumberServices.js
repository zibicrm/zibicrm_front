import { http } from "./httpServices";

export function uploadPhoneNumberService(data, header) {
  return http.post(`cellphone/upload`, data, { headers: header });
}
export function getPhoneNumberService(header) {
  return http.get(`cellphone/supplier/get`, { headers: header });
}
export function recivePhoneNumberService(header) {
  return http.get(`cellphone/supplier/receive`, { headers: header });
}

export function setStatusPhoneNumberService(data, header) {
  return http.post(`cellphone/set/status`, data, { headers: header });
}

export function getStatisticPhoneNumberService(header) {
  return http.get(`cellphone/statistic`, { headers: header });
}
