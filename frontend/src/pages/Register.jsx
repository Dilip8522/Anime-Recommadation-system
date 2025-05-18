import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import '../styles/Register.css';


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
    <div className="register-container">
      <div className="register-box">
        <div>
          <h2 className="register-heading">Create your account</h2>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-input-group">
            <input
              name="name"
              type="text"
              required
              className="register-input"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              required
              className="register-input"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="age"
              type="number"
              required
              className="register-input"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              className="register-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
  

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  //     <div className="max-w-md w-full space-y-8">
  //       <div>
  //         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
  //           Create your account
  //         </h2>
  //       </div>
  //       {error && (
  //         <div className="text-red-500 text-center">{error}</div>
  //       )}
  //       <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
  //         <div className="rounded-md shadow-sm -space-y-px">
  //           <div>
  //             <input
  //               name="name"
  //               type="text"
  //               required
  //               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
  //               placeholder="Full Name"
  //               value={formData.name}
  //               onChange={handleChange}
  //             />
  //           </div>
  //           <div>
  //             <input
  //               name="email"
  //               type="email"
  //               required
  //               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
  //               placeholder="Email address"
  //               value={formData.email}
  //               onChange={handleChange}
  //             />
  //           </div>
  //           <div>
  //             <input
  //               name="age"
  //               type="number"
  //               required
  //               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
  //               placeholder="Age"
  //               value={formData.age}
  //               onChange={handleChange}
  //             />
  //           </div>
  //           <div>
  //             <input
  //               name="password"
  //               type="password"
  //               required
  //               className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
  //               placeholder="Password"
  //               value={formData.password}
  //               onChange={handleChange}
  //             />
  //           </div>
  //         </div>

  //         <div>
  //           <button
  //             type="submit"
  //             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  //           >
  //             Register
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
} 