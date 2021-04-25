export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('table.create')) {
    return redirect('/dashboard/meja')
  }
}
