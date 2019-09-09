import request from '@/utils/request'

export function getPermissions(params) {
  return request({
    url: '/permissions',
    method: 'get',
    params
  })
}

export function addPermission(data) {
  return request({
    url: '/permissions',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/permissions',
    method: 'put',
    data
  })
}

export function getPermissionTree(params) {
  return request({
    url: '/permissions/tree',
    method: 'get',
    params
  })
}

export function getRolePermissions(params) {
  return request({
    url: '/roles/' + params.id + '/permissions',
    method: 'get',
    params
  })
}

export function updateRolePermissions(data) {
  return request({
    url: '/roles/' + data.id + '/permissions',
    method: 'post',
    data
  })
}

export function getUserPermissions(params) {
  return request({
    url: '/users/' + params.id + '/permissions',
    method: 'get',
    params
  })
}

export function updateUserPermissions(data) {
  return request({
    url: '/users/' + data.id + '/permissions',
    method: 'post',
    data
  })
}
