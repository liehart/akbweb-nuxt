export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('menu.update')) {
    return redirect('/dashboard/menu')
  }
}
