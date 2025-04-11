import { http } from "./httpServices";

export function getFinanceImages(data,header) {
  return http.post(`document/get/finance/images`,data, { headers: header });
}
export function getFinanceImagesForReportsService(data,header) {
  return http.post(`finance/images/report`,data, { headers: header });
}
