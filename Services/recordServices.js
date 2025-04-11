import { http } from "./httpServices";

export function deleteRecordService(id, header) {
  return http.delete(`document/delete/${id}`, { headers: header });
}
export function editRecordService(data, header) {
  return http.post(`document/edit`, data, { headers: header });
}
export function getAllRecordService(data, header) {
  return http.post("document/get", data, { headers: header });
}
export function getRecordService(id, header) {
  return http.get(`document/get/per/${id}`, { headers: header });
}
export function newRecordService(data, header) {
  return http.post("document/store", data, { headers: header });
}
export function searchRecordService(data, header) {
  return http.post("document/search", data, { headers: header });
}
export function getFinanceRecordService(data, header) {
  return http.post("finance/get/record", data, { headers: header });
}
export function rollbackPriceService(data, header) {
  return http.post("finance/rollback/price", data, { headers: header });
}
export function getMedicalRecordService(data, header) {
  return http.post("medical/document/get/record", data, { headers: header });
}

export function getFinanceByIdService(id, header) {
  return http.get(`finance/get/per/record/${id}`, { headers: header });
}
export function transferRecordService(data, header) {
  return http.post("document/move", data, { headers: header });
}
export function transferRecordClinicService(data, header) {
  return http.post("document/move/clinic", data, { headers: header });
}

export function ClinicRecordService(header) {
  return http.get("document/clinic/get", { headers: header });
}
export function financeDocumentAll(id, header) {
  return http.get(`finance/document/all/${id}`, { headers: header });
}
export function financeDocumentAllTransaction(id, header) {
  return http.get(`finance/document/all/transaction/${id}`, {
    headers: header,
  });
}
export function financePaymentStore(data, header) {
  return http.post("finance/payment/store", data, { headers: header });
}

export function getDocumentDepositService(id, header) {
  return http.get(`document/get/deposit/${id}`, { headers: header });
}
