export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('reservation.read')) {
    return redirect('/dashboard')
  }
}
