import request from '@/utils/request'

export function getDetails(params) {
  return request({
    url: '/jd_xjx/details',
    method: 'get',
    params
  })
}

