export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('role.update')) {
    return redirect('/dashboard/jabatan')
  }
}
