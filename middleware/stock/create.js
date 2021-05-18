export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('stock.create')) {
    return redirect('/dashboard/stok')
  }
}
