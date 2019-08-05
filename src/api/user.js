import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sessions',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: '/sessions/',
    method: 'get',
    params
  })
}

export function logout(params) {
  return request({
    url: '/sessions/',
    method: 'delete',
    params
  })
}

export function getUsers(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}
