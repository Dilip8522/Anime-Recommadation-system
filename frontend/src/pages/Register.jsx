import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { User, Mail, Lock, Calendar } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApi.register({
        ...formData,
        age: parseInt(formData.age)
      });
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed');
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
          Create your account
        </h2>

        {error && (
          <div className="text-[#ff4d4d] text-center font-medium">{error}</div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ffffaa]" size={18} />
            <input
              name="name"
              type="text"
              required
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-2 bg-[#1a1a2e] border border-[#00ffff] text-white text-sm rounded-md focus:outline-none focus:border-[#00ffff] focus:shadow-[0_0_8px_#00ffff]"
            />
          </div>

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

          {/* Age Input */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ffffaa]" size={18} />
            <input
              name="age"
              type="number"
              required
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-2 bg-[#1a1a2e] border border-[#00ffff] text-white text-sm rounded-md focus:outline-none focus:border-[#00ffff] focus:shadow-[0_0_8px_#00ffff]"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ffffaa]" size={18} />
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 w-full px-3 py-2 bg-[#1a1a2e] border border-[#00ffff] text-white text-sm rounded-md focus:outline-none focus:border-[#00ffff] focus:shadow-[0_0_8px_#00ffff]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center px-4 py-2 bg-[#00ffff] text-[#0f0f1a] font-semibold rounded-md transition-all duration-300 hover:bg-[#00ccff] hover:shadow-[0_0_12px_#00ffff]"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3b82f6] font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authApi } from '../services/api';
// import '../styles/Register.css';


// export default function Register() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     age: ''
//   });
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await authApi.register({
//         ...formData,
//         age: parseInt(formData.age)
//       });
//       navigate('/login');
//     } catch (err) {
//       console.error('Registration error:', err);
//       setError(err.response?.data?.detail || 'Registration failed');
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };
//   return (
//     <div className="register-container">
//       <div className="register-box">
//         <div>
//           <h2 className="register-heading">Create your account</h2>
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         <form className="register-form" onSubmit={handleSubmit}>
//           <div className="register-input-group">
//             <input
//               name="name"
//               type="text"
//               required
//               className="register-input"
//               placeholder="Full Name"
//               value={formData.name}
//               onChange={handleChange}
//             />
//             <input
//               name="email"
//               type="email"
//               required
//               className="register-input"
//               placeholder="Email address"
//               value={formData.email}
//               onChange={handleChange}
//             />
//             <input
//               name="age"
//               type="number"
//               required
//               className="register-input"
//               placeholder="Age"
//               value={formData.age}
//               onChange={handleChange}
//             />
//             <input
//               name="password"
//               type="password"
//               required
//               className="register-input"
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//             />
//           </div>
//           <button type="submit" className="register-button">Register</button>
//         </form>
//       </div>
//     </div>
//   );
// } 