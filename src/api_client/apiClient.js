import axios from "axios";
import store from "../store";
import { isRefreshTokenExpired } from "../reducers/";

store.subscribe(listener);

function select(state) {
  return state.auth;
}

function listener() {
 var auth = select(store.getState())
 if (auth.access) {
  axios.defaults.headers.common['Authorization'] = "token=" + auth.access.token;
 }
}

export var serverAddress = "http://localhost:8000"
// This is a dirty hack. Grabs current host for when sharing. URL handling needs cleaned up. DW 12-13-20
export var shareAddress = window.location.host;

export var Server = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Content-Type': 'application/json'
  },
  //withCredentials:true,
  timeout: 30000,
});

Server.interceptors.request.use(
  function (request) {
    return request;
  },
  function (error) {}
);

Server.interceptors.response.use(function (response) {
    return response;
  }, function (error) {

  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry && !isRefreshTokenExpired(store.getState())) {
    console.log("here 1")
    originalRequest._retry = true;

    const auth = select(store.getState())
    const refreshToken = auth.refresh.token
    return Server.post(serverAddress+'/auth/token/refresh/', { refresh:refreshToken })
      .then((response) => {
	store.dispatch({type: "REFRESH_ACCESS_TOKEN_FULFILLED", payload: response.data})
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access;
        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
        if (originalRequest.baseURL == originalRequest.url.substring(0, 5)) {
          originalRequest.baseURL = ''
        }
        return Server(originalRequest);
      });
  }
  console.log("here 2")
  return Promise.reject(error);
});

export default { serverAddress, Server, shareAddress };
