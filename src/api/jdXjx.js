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

export function addAuction(data) {
  return request({
    url: '/jd_xjx/auctions',
    method: 'post',
    data
  })
}

export function getDicts(params) {
  return request({
    url: '/jd_xjx/dicts',
    method: 'get',
    params
  })
}

export function getOrders(params) {
  return request({
    url: '/jd_xjx/orders',
    method: 'get',
    params
  })
}
