import { http } from "./httpServices";

export function getAllFinanceService(data, header) {
  return http.post("finance/get/report", data, { headers: header });
}

export function getUnseenFinanceService(data, header) {
  return http.post("finance/get/report/unseen", data, { headers: header });
}

export function setStatusFinanceService(data, header) {
  return http.post("finance/set/treatment/status", data, { headers: header });
}

export function getChecksService(data, header) {
  return http.post("finance/get/check", data, { headers: header });
}

export function getStatusChecksService(data, header) {
  return http.post("finance/set/check/status", data, { headers: header });
}

export function getTodayChecksService(data, header) {
  return http.post("finance/get/check/today", data, { headers: header });
}

export function getReturnChecksService(data, header) {
  return http.post("finance/get/check/return", data, { headers: header });
}

export function getRullbackChecksService(data, header) {
  return http.post("finance/rollback", data, { headers: header });
}

export function setRollbackStatusFinanceService(data, header) {
  return http.post("finance/set/rollback/status", data, { headers: header });
}

export function getTodayRollbackFinanceService(header) {
  return http.get("finance/rollback/today", { headers: header });
}

export function getWaitRollbackFinanceService(data, header) {
  return http.post("finance/rollback/wait", data, { headers: header });
}

export function searchChecksService(data, header) {
  return http.post("finance/get/check/search", data, { headers: header });
}

export function searchReportService(data, header) {
  return http.post("finance/get/report/search", data, { headers: header });
}
export function todayPeymentService(data, header) {
  return http.post("finance/panel/today/payment", data, { headers: header });
}
export function internalCheckStoreService(data, header) {
  return http.post("finance/check/store", data, { headers: header });
}
export function getInternalCheckService(data, header) {
  return http.post("finance/check/list", data, { headers: header });
}
export function setInternalCheckStatusService(data, header) {
  return http.post("finance/check/set/status", data, { headers: header });
}

export function todayInternalCheckService(header) {
  return http.get("finance/check/due/date", { headers: header });
}

export function searchInternalCheckService(data, header) {
  return http.post("finance/check/internal/search", data, { headers: header });
}

export function filterInternalCheckService(data, header) {
  return http.post("finance/check/list/filter", data, { headers: header });
}
