import { http } from "./httpServices";

export function patientDocumentAll(id, header) {
  return http.get(`patient/document/all/${id}`, { headers: header });
}

export function patientDocumentAllTransaction(id, header) {
  return http.get(`patient/document/all/transaction/${id}`, {
    headers: header,
  });
}

export function getAllAppointments(header) {
  return http.get(`patient/appointment`, {
    headers: header,
  });
}

export function getAllChecks(header) {
  return http.get(`patient/check`, {
    headers: header,
  });
}




