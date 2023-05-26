import axios from "axios";

export function postMethod(url = "", data = {}) {
  url = 'http://localhost:8080/' + url
  return axios.post(url, data);
}

export function getMethod(url = "") {
  url = 'http://localhost:8080/' + url

  return axios.get(url);
}

export async function deleteMethod(url = "") {
  url = 'http://localhost:8080/' + url

  return axios.delete(url);
}