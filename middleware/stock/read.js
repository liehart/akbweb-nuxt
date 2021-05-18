export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('stock.read')) {
    return redirect('/dashboard')
  }
}
