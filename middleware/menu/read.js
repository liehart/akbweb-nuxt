export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('menu.read')) {
    return redirect('/dashboard')
  }
}
