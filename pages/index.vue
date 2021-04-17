<template>
  <div>
    Hellow orld
    {{ user }}
    <button @click="userLogout">
      Logout
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: this.$auth.user
    }
  },
  methods: {
    userLogout () {
      this.$auth.logout().then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>
