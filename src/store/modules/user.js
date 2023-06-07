import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

const state = {
  token: getToken(),
  userInfo: {}
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token) // vuex和缓存数据的同步
  },

  removeToken(state) {
    state.token = null
    removeToken() // vuex和缓存数据的同步
  },

  setUserInfo(state, result) {
    state.userInfo = result
  },

  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  async login(context, data) {
    const res = await login(data) // 拿到token
    context.commit('setToken', res) // 设置token
    setTimeStamp()
  },

  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    context.commit('setUserInfo', { ...res, ...baseInfo })
    return res
  },

  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
