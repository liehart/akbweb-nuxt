export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('table.update')) {
    return redirect('/dashboard/meja')
  }
}
