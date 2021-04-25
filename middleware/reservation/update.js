export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('reservation.update')) {
    return redirect('/dashboard/reservasi')
  }
}
