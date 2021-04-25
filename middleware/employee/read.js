export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('employee.read')) {
    return redirect('/dashboard')
  }
}
