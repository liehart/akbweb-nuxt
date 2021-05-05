export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('menu.delete')) {
    return redirect('/dashboard/menu')
  }
}
