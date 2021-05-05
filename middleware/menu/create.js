export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('menu.create')) {
    return redirect('/dashboard/menu')
  }
}
