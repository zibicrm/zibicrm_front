import { http } from "./httpServices";

export function patientGetOTPCode(data) {
  return http.post("patient/otp", data);
}

export function patientLogin(data) {
  return http.post("patient/login", data);
}
