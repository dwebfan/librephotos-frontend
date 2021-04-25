import { push } from 'react-router-redux';
import { Server } from '../api_client/apiClient';

const argon2 = require('argon2-browser')

export const LOGIN_REQUEST = '@@auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@@auth/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@@auth/LOGIN_FAILURE';

export const TOKEN_REQUEST = '@@auth/TOKEN_REQUEST';
export const TOKEN_RECEIVED = '@@auth/TOKEN_RECEIVED';
export const TOKEN_FAILURE = '@@auth/TOKEN_FAILURE';

export function signup(username,password,email,firstname,lastname) {
  return function(dispatch) {
    dispatch({type:"SIGNUP"})
    Server.post('/user/', {email:email,
        username:username,
        password:password,
        scan_directory:'initial',
        first_name:firstname,
        last_name:lastname})
      .then((response) => {
        dispatch({type: "SIGNUP_FULFILLED", payload: response.data})
        dispatch(push('/login'))
      })
      .catch((err) => {
        dispatch({type: "SIGNUP_REJECTED", payload: err})
      })
  }
}

export function login(serverAddress,username,password,from) {
  return function(dispatch) {_
    dispatch({type:"LOGIN"})
    console.log(serverAddress,username,password,from)
    argon2.hash({ pass: password, salt: username+"@lomorage.lomoware", 
      time: 3, mem: 4096, parallelism: 1, hashLen: 32, type: argon2.ArgonType.Argon2id})
      .then(h => {
        console.log(h.hash, h.hashHex, h.encoded)
        var hashedPwd = [];
        for (var n = 0; n < h.encoded.length; n++) {
          hashedPwd += Number(h.encoded.charCodeAt(n)).toString(16);
        }
        hashedPwd += '00'
        console.log(hashedPwd)
        var auth = btoa(username + ":" + hashedPwd + ":react")
        console.log(auth)
        Server.get('/login?username='+username+'&password='+hashedPwd+'&device=react', { crossdomain: true })
        //Server.get('/login', { crossdomain: true }, {
        //  headers: {'Authorization': 'Basic ' + auth}
        //})
        .then((response) => {
          console.log("success")
          dispatch({type: "LOGIN_FULFILLED", payload: response.data})
          dispatch(push(from))
        })
        .catch((err) => {
          console.log("failure: " + err)
          dispatch({type: "LOGIN_REJECTED", payload: err})
        })
      })
      .catch(e => console.error(e.message, e.code))
  }
}


export function refreshAccessToken(token) {
  return function(dispatch) {
    dispatch({type:"REFRESH_ACCESS_TOKEN"})
    Server.post('/auth/token/refresh/', {refresh:token})
      .then((response) => {
        dispatch({type: "REFRESH_ACCESS_TOKEN_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "REFRESH_ACCESS_TOKEN_REJECTED", payload: err})
      })
  }
}

export function logout() {
  return function(dispatch) {
    dispatch({type:"LOGOUT"})
  }
}
