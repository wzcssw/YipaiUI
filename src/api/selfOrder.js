import request from '@/utils/request'

export function getSelfOrders(params) {
  return request({
    url: '/api/self_orders/list',
    method: 'get',
    params
  })
}

export function saveSelfOrders(data) {
  return request({
    url: '/api/self_orders/save',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/api/self_orders/update_status',
    method: 'post',
    data
  })
}

