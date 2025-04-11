import { http } from "./httpServices";

export function newService(data, header) {
  return http.post("service/store", data, { headers: header });
}
export function deleteService(id, header) {
  return http.delete(`service/delete/${id}`, { headers: header });
}
export function getAllService(header) {
  return http.get("service/get", { headers: header });
}
export function getService(id, header) {
  return http.get(`service/get/per/${id}`, { headers: header });
}
export function editService(id, data, header) {
  return http.post(`service/edit/${id}`, data, { headers: header });
}
export function getServiceByClinic(id, header) {
  return http.get(`service/clinic/${id}`, { headers: header });
}
