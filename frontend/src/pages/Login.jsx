import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.login(formData);
      login(response.data.token);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] relative overflow-hidden px-4 py-12 text-white">
      {/* Animated background glow */}
      <div className="absolute w-[400px] h-[400px] bg-[#00ffff30] blur-[160px] rounded-full animate-pulse"></div>

      <div className="w-full max-w-md z-10 bg-[#1a1a2e] border border-[#00ffff55] rounded-2xl shadow-[0_0_30px_#00ffff40] p-10 space-y-8">
        <h2 className="text-center text-3xl font-extrabold font-orbitron text-[#00ffff] drop-shadow-[0_0_10px_#00ffff]">
          Sign in to your account
        </h2>

        {error && (
          <div className="text-[#ff4d4d] text-center font-medium">{error}</div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ffffaa]" size={18} />
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-2 bg-[#1a1a2e] border border-[#00ffff] text-white text-sm rounded-md focus:outline-none focus:border-[#00ffff] focus:shadow-[0_0_8px_#00ffff]"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ffffaa]" size={18} />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10 w-full px-3 py-2 bg-[#1a1a2e] border border-[#00ffff] text-white text-sm rounded-md focus:outline-none focus:border-[#00ffff] focus:shadow-[0_0_8px_#00ffff]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00ffffaa] hover:text-[#00ffff]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center px-4 py-2 bg-[#00ffff] text-[#0f0f1a] font-semibold rounded-md transition-all duration-300 hover:bg-[#00ccff] hover:shadow-[0_0_12px_#00ffff]"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-[#3b82f6] font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}


// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { authApi } from '../services/api';
// import { useAuth } from '../context/AuthContext';

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await authApi.login(formData);
//       login(response.data.token);
//       navigate('/');
//     } catch (err) {
//       console.error('Login error:', err);
//       setError('Invalid credentials');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] p-12 text-white">
//       <div className="max-w-md w-full flex flex-col gap-8">
//         <div>
//           <h2 className="text-center text-3xl font-extrabold font-orbitron text-[#00ffff] drop-shadow-[0_0_10px_#00ffff]">
//             Sign in to your account
//           </h2>
//         </div>
//         {error && (
//           <div className="text-[#ff4d4d] text-center">{error}</div>
//         )}
//         <form className="flex flex-col gap-6 mt-8" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-[0_0_10px_rgba(0,255,255,0.2)]">
//             <input
//               name="email"
//               type="email"
//               required
//               className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#00ffff] text-white text-sm rounded-md focus:outline-none focus:border-[#00ffff] focus:shadow-[0_0_5px_#00ffff]"
//               placeholder="Email address"
//               value={formData.email}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="rounded-md shadow-[0_0_10px_rgba(0,255,255,0.2)]">
//             <input
//               name="password"
//               type="password"
//               required
//               className="w-full px-3 py-2 bg-[#1a1a2e] border border-[#00ffff] text-white text-sm rounded-md focus:outline-none focus:border-[#00ffff] focus:shadow-[0_0_5px_#00ffff]"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="w-full flex justify-center px-4 py-2 bg-[#00ffff] text-[#0f0f1a] font-medium text-sm rounded-md transition-all duration-300 hover:bg-[#00ccff] hover:shadow-[0_0_10px_#00ffff]"
//             >
//               Sign in
//             </button>
//           </div>
//         </form>
//         <p className="mt-4 text-center text-sm">
//           Don't have an account?{' '}
//           <Link to="/register" className="text-[#3b82f6] font-medium hover:underline">
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
