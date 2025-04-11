import { http } from "./httpServices";

export function getLatestDocumentAppointmentService(data, header) {
  return http.post(`appointment/get/latest`,data, { headers: header });
}
