import { http } from "./httpServices";

export function deleteClinicService(id, header) {
  return http.delete(`clinic/delete/${id}`, { headers: header });
}
export function editClinicService(id, data, header) {
  return http.post(`clinic/edit/${id}`, data, { headers: header });
}
export function getAllClinicService( header) {
  return http.get("clinic/get", { headers: header });
}
export function getClinicService(id, header) {
  return http.get(`clinic/get/per/${id}`, { headers: header });
}
export function newClinicService(data, header) {
  return http.post("clinic/store", data, { headers: header });
}

