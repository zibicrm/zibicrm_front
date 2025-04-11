import { http } from "./httpServices";

export function getAllAppointmentVisitService(data, header) {
  return http.post("doctor/calender/get/visit", data, { headers: header });
}

export function getAllDoctorsAppointmentSurgeryService(data, header) {
  return http.post("doctor/calender/get", data, { headers: header });
}

export function getInfoAppointmentSurgeryService(data, header) {
  return http.post("doctor/calender/appointment/surgery/info", data, {
    headers: header,
  });
}

export function getInfoAppointmentVisitService(data, header) {
  return http.post("doctor/calender/appointment/info", data, {
    headers: header,
  });
}

export function appointmentSurgeryService(data, header) {
  return  http.post('appointment/surgery/reception', data, { headers: header })
}

export function appointmentVisitService(data, header) {
  return  http.post('appointment/reception', data, { headers: header })
}
