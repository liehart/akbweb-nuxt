export const state = () => ({
  roleList: []
})

export const mutations = {
  setRoleList (state, list) {
    state.roleList = list
  },
  clearRoleList (state) {
    state.roleList = []
  }
}

export const actions = {
  async fetchRoleList ({ commit }) {
    try {
      const res = await this.$axios.get('select/role')
      commit('setRoleList', res.data.data)
    } catch (e) {}
  }
}
