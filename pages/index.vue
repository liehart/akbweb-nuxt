<script>
export default {
  beforeRouteEnter (to, from, next) {
    next('/dashboard')
  },
  layout: 'guest',
  data () {
    return {}
  }
}
</script>
