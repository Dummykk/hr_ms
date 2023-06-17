import request from '@/utils/request'

export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

export function delEmployee(id) {
  return request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}

export function addEmployee(data) {
  return request({
    method: 'POST',
    url: '/sys/user',
    data
  })
}

export function importEmployee(data) {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}

export function saveUserDetailById(data) {
  return request({
    method: 'PUT',
    url: `/sys/user/${data.id}`,
    data
  })
}

export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'PUT',
    data
  })
}

export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'PUT',
    data
  })
}

export function assignRoles(data) {
  return request({
    method: 'PUT',
    url: '/sys/user/assignRoles',
    data
  })
}
