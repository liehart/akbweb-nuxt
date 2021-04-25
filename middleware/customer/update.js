export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('customer.update')) {
    return redirect('/dashboard/pelanggan')
  }
}
