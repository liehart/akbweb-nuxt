export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('employee.delete')) {
    return redirect('/dashboard/pegawai')
  }
}
