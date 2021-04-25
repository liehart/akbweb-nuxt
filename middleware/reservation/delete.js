export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('reservation.delete')) {
    return redirect('/dashboard/reservasi')
  }
}
