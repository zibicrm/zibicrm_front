import { http } from "./httpServices";

export function deleteDoctorService(id, header) {
  return http.delete(`doctor/delete/${id}`, { headers: header });
}
export function getAllDoctorService(header) {
  return http.get("doctor/get", { headers: header });
}
export function getDoctorService(id, header) {
  return http.get(`doctor/get/per/${id}`, { headers: header });
}
export function newDoctorService(data, header) {
  return http.post("doctor/store", data, { headers: header });
}
export function getDoctorByClinicService(id, header) {
  return http.get(`doctor/clinic/${id}`, { headers: header });
}
export function editDoctorService(data, header) {
  return http.post(`doctor/edit`, data, { headers: header });
}
export function addDayService(data, header) {
  return http.post(`doctor/store/day`, data, { headers: header });
}
export function addTimeService(data, header) {
  return http.post(`doctor/store/time`, data, { headers: header });
}
export function deleteDayService(id, header) {
  return http.delete(`doctor/day/${id}`, { headers: header });
}

export function deleteTimeService(id, header) {
  return http.delete(`doctor/time/${id}`, { headers: header });
}
export function EditTimeService(data, header) {
  return http.post(`doctor/edit/time`, data, { headers: header });
}
