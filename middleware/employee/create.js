export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('employee.create')) {
    return redirect('/dashboard/pegawai')
  }
}
