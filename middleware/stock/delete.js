export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('stock.delete')) {
    return redirect('/dashboard/bahan')
  }
}
