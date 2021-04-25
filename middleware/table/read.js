export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('table.read')) {
    return redirect('/dashboard')
  }
}
