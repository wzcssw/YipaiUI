import request from '@/utils/request'

export function getDetails(params) {
  return request({
    url: '/jd_xjx/details',
    method: 'get',
    params
  })
}

export function getComposes(params) {
  return request({
    url: '/jd_xjx/composes',
    method: 'get',
    params
  })
}

export function addAuction(params) {
  return request({
    url: '/jd_xjx/auctions',
    method: 'post',
    params
  })
}

export function getDicts(params) {
  return request({
    url: '/jd_xjx/dicts',
    method: 'get',
    params
  })
}
