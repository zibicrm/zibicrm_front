import { http } from "./httpServices";

export function deletePatientStatusService(id, header) {
  return http.delete(`document/status/delete/${id}`, { headers: header });
}
export function getAllPatientStatusService(header) {
  return http.get("document/status/get", { headers: header });
}
export function getPatientStatusService(id, header) {
  return http.get(`document/status/get/per/${id}`, { headers: header });
}
export function newPatientStatusService(data, header) {
  return http.post("document/status/store", data, { headers: header });
}
export function editPatientStatusService(id, data, header) {
  return http.post(`document/status/edit/${id}`, data, { headers: header });
}
