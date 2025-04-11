import { http } from "./httpServices";

export function treatmentService(data, header) {
  return http.post("treatment/store", data, { headers: header });
}

export function getTreatmentByIdService(data, header) {
  return http.post("document/get/treatment", data, { headers: header });
}

export function deleteTreatmentService(id, header) {
  return http.delete(`treatment/delete/${id}`, { headers: header });
}

export function storeTreatmentPlanService(data, header) {
  return http.post(`treatment/plan/store`, data, { headers: header });
}

export function deleteTreatmentPlanService(id, header) {
  return http.post(`treatment/plan/delete/detail/${id}`, {
    headers: header,
  });
}
