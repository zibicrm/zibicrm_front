import axios from "axios";
axios.defaults.baseURL = "https://radmanit.ir/api";

export const http = {
  post: axios.post,
  get: axios.get,
  delete: axios.delete,
  put: axios.put,
  patch: axios.patch,
};
