export const state = () => ({
  employee: []
})

export const mutations = {
  setEmployee (state, employee) {
    state.employee = employee
  },
  clearEmployee (state) {
    state.employee = []
  }
}
