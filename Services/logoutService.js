import { http } from "./httpServices";

export function logoutService(header) {
  return http.get("logout", { headers: header });
}
