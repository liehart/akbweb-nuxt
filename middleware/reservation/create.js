export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('reservation.create')) {
    return redirect('/dashboard/reservasi')
  }
}
