import { http } from "./httpServices";

export function deleteParaclinicService(id, header) {
  return http.delete(`paraclinic/delete/${id}`, { headers: header });
}
export function getAllParaclinicService(header) {
  return http.get("paraclinic/get", { headers: header });
}
export function getParaclinicService(id, header) {
  return http.get(`paraclinic/get/per/${id}`, { headers: header });
}

export function newParaclinicService(data, header) {
  return http.post("paraclinic/store", data, { headers: header });
}
export function getParaclinicTypeService(header) {
  return http.get("paraclinic/get/types", { headers: header });
}
export function editParaclinicService(id, data, header) {
  return http.post(`paraclinic/edit/${id}`, data, { headers: header });
}
