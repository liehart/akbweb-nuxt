export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('role.read')) {
    return redirect('/dashboard')
  }
}
