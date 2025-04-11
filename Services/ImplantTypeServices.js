import { http } from "./httpServices";

export function deleteImplantTypeService(id, header) {
  return http.delete(`implant/type/delete/${id}`, { headers: header });
}

export function newImplantTypeService(data, header) {
  return http.post("implant/type/store", data, { headers: header });
}
export function editImplantTypeService(id, data, header) {
  return http.post(`implant/type/edit/${id}`, data, { headers: header });
}

export function getAllImplantTypeService(header) {
  return http.get("implant/type/get", { headers: header });
}

export function getImplantTypeService(id, header) {
  return http.get(`implant/type/get/per/${id}`, { headers: header });
}
