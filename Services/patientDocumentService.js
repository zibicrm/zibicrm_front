import { http } from "./httpServices";

export function editPatientDocument(data, header) {
  return http.post(`patient/document/edit`, data, {
    headers: header,
  });
}

export function patientIntroduction(data, header) {
  return http.post(`patient/introduction`, data, {
    headers: header,
  });
}

export function getPatientIntroductionList(header) {
  return http.get(`patient/introduction/get`, {
    headers: header,
  });
}
