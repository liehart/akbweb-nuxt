export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('employee.update')) {
    return redirect('/dashboard/pegawai')
  }
}
