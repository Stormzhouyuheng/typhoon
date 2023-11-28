import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token';
const mapFlagKey = 'mapRouteFlag';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setMapRouteFlag() {
  return Cookies.set(mapFlagKey, true)
}
export function getMapRouteFlag() {
  return Cookies.get(mapFlagKey)
}

export function removeMapRouteFlag() {
  return Cookies.remove(mapFlagKey)
}
