export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('ingredient.read')) {
    return redirect('/dashboard')
  }
}
