import { http } from "./httpServices";

export function deleteFinancialService(id, header) {
  return http.delete(`financial/action/delete/${id}`, { headers: header });
}
