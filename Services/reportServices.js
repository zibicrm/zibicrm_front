import { http } from "./httpServices";

export function reportUserDayilyService(data, header) {
  return http.post(`report/user/daily`, data, { headers: header });
}
export function reportUserAppointmentService(data, header) {
  return http.post(`report/user/appointments`, data, { headers: header });
}
export function reportUserDailySupplierService(data, header) {
  return http.post(`report/user/daily/supplier`, data, { headers: header });
}
export function reportCompareSupplierAppointmentService(data, header) {
  return http.post(`report/user/compare/appointment`, data, {
    headers: header,
  });
}
export function reportCompareSupplierAppointmentSurgery(data, header) {
  return http.post(`report/user/compare/appointment/surgery`, data, {
    headers: header,
  });
}
export function reportUserImplant(data, header) {
  return http.post(`report/user/implant`, data, { headers: header });
}
export function reportUserSurgeryAppointmentService(data, header) {
  return http.post(`report/user/appointments/surgery`, data, {
    headers: header,
  });
}
export function reportReferAppointmentService(header) {
  return http.get(`report/refer/appointment`, {
    headers: header,
  });
}
export function reportReferSurgeryAppointmentService(header) {
  return http.get(`report/refer/appointment/surgery`, {
    headers: header,
  });
}
export function reportDocumentCountService(data, header) {
  return http.post(`report/user/document`, data, {
    headers: header,
  });
}
export function reportAllEventService(data, header) {
  return http.post(`report/all/event`, data, {
    headers: header,
  });
}
``;
export function reportSupplierCellPhoneService(data, header) {
  return http.post(`report/supplier/cellphone`, data, {
    headers: header,
  });
}
export function reportClinicDaily(data, header) {
  return http.post(`report/clinic/daily`, data, {
    headers: header,
  });
}
export function reportClinicCompareDoctor(data, header) {
  return http.post(`report/clinic/compare/doctor`, data, {
    headers: header,
  });
}
export function reportClinicIncome(data, header) {
  return http.post(`report/clinic/Income`, data, {
    headers: header,
  });
}
export function reportUserCompareAppointmentSurgery(data, header) {
  return http.post(`report/user/compare/appointment/surgery`, data, {
    headers: header,
  });
}
export function reportClinicAppointment(data, header) {
  return http.post(`report/clinic/appointment`, data, {
    headers: header,
  });
}
export function reportCompareUserAllAppointments(data, header) {
  return http.post(`report/user/all/appointments`, data, {
    headers: header,
  });
}
export function reportUserPorsantService(data, header) {
  return http.post(`report/user/commission`, data, {
    headers: header,
  });
}

export function reportUserEventService(data, header) {
  return http.post(`report/event/user`, data, {
    headers: header,
  });
}
export function eventGetTodayLaboratory(header) {
  return http.get(`event/get/today/laboratory `, {
    headers: header,
  });
}
export function eventReceiveLaboratory(id, header) {
  return http.get(`/event/receive/laboratory/${id}`, {
    headers: header,
  });
}
export function eventGetTodayLaboratoryFollowup(header) {
  return http.get(`event/get/today/laboratory/followup`, {
    headers: header,
  });
}

export function eventFollowUpLaboratoryDone(id, header) {
  return http.get(`event/laboratory/followup/done/${id}`, {
    headers: header,
  });
}
