import request from '@/utils/request'

export function startProcess(data) {
  return request({
    method: 'POST',
    url: '/user/process/startProcess',
    data
  })
}
