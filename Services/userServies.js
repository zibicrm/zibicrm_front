import { http } from "./httpServices";

export function newUserService(data, header) {
  return http.post("user/store", data, { headers: header });
}
export function getUserService(id, header) {
  return http.get(`user/get/per/${id}`, { headers: header });
}
export function getUserRuleService(header) {
  return http.get(`rule/get`, { headers: header });
}
export function getAllUsersService(data, header) {
  return http.post("user/get", data, { headers: header });
}
export function editUserService(id, data, header) {
  return http.post(`user/edit/${id}`, data, { headers: header });
}
export function deleteUserService(id, header) {
  return http.delete(`user/delete/${id}`, { headers: header });
}
export function changePasswordUserService(data, header) {
  return http.post("user/password/change", data, { headers: header });
}
export function adminChangePasswordUserService(data, header) {
  return http.post("password/change/user", data, { headers: header });
}
