export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('stock.update')) {
    return redirect('/dashboard/stok')
  }
}
