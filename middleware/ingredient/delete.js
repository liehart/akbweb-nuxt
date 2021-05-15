export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('ingredient.delete')) {
    return redirect('/dashboard/bahan')
  }
}
