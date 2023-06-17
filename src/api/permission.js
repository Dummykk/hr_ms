import request from '@/utils/request'

export function getPermissionList() {
  return request({
    url: '/sys/permission'
  })
}

export function addPermission(data) {
  return request({
    method: 'POST',
    url: '/sys/permission',
    data
  })
}

export function getPermissionDetail(id) {
  return request({
    url: `/sys/permission/${id}`
  })
}

export function updatePermission(data) {
  return request({
    method: 'PUT',
    url: `/sys/permission/${data.id}`,
    data
  })
}

export function delPermission(id) {
  return request({
    method: 'DELETE',
    url: `/sys/permission/${id}`
  })
}

export function assignPermission(data) {
  return request({
    method: 'PUT',
    url: '/sys/role/assignPrem',
    data
  })
}
