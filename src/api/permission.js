import request from '@/utils/request'

export function getPermissions(params) {
  return request({
    url: '/permissions',
    method: 'get',
    params
  })
}
