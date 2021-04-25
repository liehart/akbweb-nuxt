export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('role.create')) {
    return redirect('/dashboard/jabatan')
  }
}
