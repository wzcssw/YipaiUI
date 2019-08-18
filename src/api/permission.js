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
