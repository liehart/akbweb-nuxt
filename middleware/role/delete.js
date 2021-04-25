export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('role.delete')) {
    return redirect('/dashboard/jabatan')
  }
}
