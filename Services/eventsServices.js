import { http } from "./httpServices";

export function newEventService(data, header) {
  return http.post("event/store", data, { headers: header });
}

export function getAllEventService(data, header) {
  return http.post("event/get", data, { headers: header });
}

export function getEventService(id, data, header) {
  return http.get(`clinic/event/per/${id}`, data, { headers: header });
}
export function DeleteFollowUpService(id, header) {
  return http.delete(`event/delete/follow/up/${id}`, { headers: header });
}
