export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('table.delete')) {
    return redirect('/dashboard/meja')
  }
}
