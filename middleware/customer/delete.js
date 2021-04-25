export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('customer.delete')) {
    return redirect('/dashboard/pelanggan')
  }
}
