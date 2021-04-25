export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('customer.read')) {
    return redirect('/dashboard')
  }
}
