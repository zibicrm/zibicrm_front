import { http } from "./httpServices";

export function getClinicFinanceReportService(data, header) {
  return http.post(`finance/clinic/report`, data, { headers: header });
}


export function getAllFinanceReportService(data, header) {
  return http.post(`finance/clinic/report/statistics`, data, { headers: header });
}