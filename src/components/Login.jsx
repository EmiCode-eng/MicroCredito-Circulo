import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { loginWithGoogle, currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    await loginWithGoogle()
    navigate('/dashboard')
  }

  if (currentUser) {
    navigate('/dashboard')
    return
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-blue-100 px-4">
      <div className="p-10 bg-white rounded-2xl shadow-xl text-center max-w-sm w-full border border-blue-100">
        <h1 className="text-3xl font-bold mb-3 text-blue-700 tracking-tight">
          MicroCrédito Círculo
        </h1>
        <p className="mb-8 text-gray-600 text-sm">
          Tu reputación es tu mejor aval.
        </p>


        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 px-6 py-3 w-full bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all font-medium text-gray-700"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="w-6 h-6"
          />
          <span>Entrar con Google</span>
        </button>
      </div>
    </div>
  )
}
