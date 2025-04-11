import { http } from "./httpServices";

export function LoginUserService(data) {
  return http.post("login", data);
}
