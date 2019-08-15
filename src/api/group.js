import request from '@/utils/request'

export function getGroups(params) {
  return request({
    url: '/groups',
    method: 'get',
    params
  })
}

export function addGroup(data) {
  return request({
    url: '/groups',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: '/groups',
    method: 'put',
    data
  })
}
