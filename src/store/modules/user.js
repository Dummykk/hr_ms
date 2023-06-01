import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken()
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token) // vuex和缓存数据的同步
  },

  removeToken(state) {
    state.token = null
    removeToken() // vuex和缓存数据的同步
  }
}

const actions = {
  async login(context, data) {
    const res = await login(data) // 拿到token
    context.commit('setToken', res) // 设置token
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
