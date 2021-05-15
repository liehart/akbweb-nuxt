export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('ingredient.create')) {
    return redirect('/dashboard/bahan')
  }
}
