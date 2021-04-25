export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('customer.create')) {
    return redirect('/dashboard/pelanggan')
  }
}
