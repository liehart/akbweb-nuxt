export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('ingredient.update')) {
    return redirect('/dashboard/bahan')
  }
}
