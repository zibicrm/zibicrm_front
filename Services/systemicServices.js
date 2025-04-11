import { http } from "./httpServices";

export function newSystemicService(data, header) {
  return http.post("systemic/store", data, { headers: header });
}

export function getSystemicService(id, header) {
  return http.get(`systemic/get/per/${id}`, { headers: header });
}

export function getAllSystemicService( header) {
  return http.get("systemic/get", { headers: header });
}
export function editSystemicService(id, data, header) {
  return http.post(`systemic/edit/${id}`, data, { headers: header });
}
export function deleteSystemicService(id, header) {
  return http.delete(`systemic/delete/${id}`, { headers: header });
}
