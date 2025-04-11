import { http } from "./httpServices";

export function uploadImageService(data, header) {
  return http.post("image/document/upload", data, { headers: header });
}
export function uploadRecordImageService(data, header) {
  return http.post("image/document/upload/paper", data, { headers: header });
}
export function getRecordImageService(id, header) {
  return http.post(`document/get/images/${id}`, { headers: header });
}

export function deleteRecordImageService(id, header) {
  return http.delete(`image/document/delete/paper/${id}`, { headers: header });
}
