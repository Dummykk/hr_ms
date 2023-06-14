import requst from '@/utils/request'

export function getRoleList(params) {
  return requst({
    url: '/sys/role',
    params
  })
}

export function getCompanyInfo(id) {
  return requst({
    url: '/company',
    params: id
  })
}

export function deleteRole(id) {
  return requst({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}

export function editRole(data) {
  return requst({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
}

export function getRoleDetail(id) {
  return requst({
    url: `/sys/role/${id}`
  })
}

export function addRole(data) {
  return requst({
    method: 'POST',
    url: '/sys/role',
    data
  })
}
