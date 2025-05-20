import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { authService } from "../services/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(authService.isAuthenticated());

  useEffect(() => {
    // Update auth state on mount or route change
    setIsAuth(authService.isAuthenticated());
  }, [location]);

  const handleLogout = () => {
    authService.removeToken();
    setIsAuth(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const protectedPaths = ["/wishlist", "/categories", "/profile", "/dashboard"];
    if (!authService.isAuthenticated() && protectedPaths.includes(location.pathname)) {
      navigate("/login");
    }
  }, [location]);

  return (
    <nav className="bg-[#0f0f1a] shadow-md shadow-cyan-400/20 sticky top-0 z-50 px-6 py-4">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-orbitron text-cyan-400 drop-shadow-md"
        >
          Anime Recommender
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-white hover:text-cyan-400 hover:drop-shadow-lg">
            Home
          </Link>
          <Link to="/categories" className="text-white hover:text-cyan-400 hover:drop-shadow-lg">
            Categories
          </Link>
          <Link to="/wishlist" className="text-white hover:text-cyan-400 hover:drop-shadow-lg">
            Wishlist
          </Link>
          {isAuth && (
            <Link to="/dashboard" className="text-white hover:text-cyan-400 hover:drop-shadow-lg">
              Dashboard
            </Link>
          )}
          {isAuth ? (
            <button
              onClick={handleLogout}
              className="text-white hover:text-cyan-400 hover:drop-shadow-lg"
              type="button"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-cyan-400 hover:drop-shadow-lg">
                Login
              </Link>
              <Link to="/register" className="text-white hover:text-cyan-400 hover:drop-shadow-lg">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}


// import { useEffect, useState } from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { authService } from '../services/auth';
// import '../styles/Navbar.css';

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isAuth, setIsAuth] = useState(false);

//   useEffect(() => {
//     // Update auth state on mount or route change
//     setIsAuth(authService.isAuthenticated());
//   }, [location]);

//   const handleLogout = () => {
//     authService.removeToken();
//     setIsAuth(false);
//     navigate('/login', { replace: true });
//   };

//   // Redirect if user is not logged in and tries to access protected pages
//   useEffect(() => {
//     const protectedPaths = ['/wishlist', '/categories', '/profile', '/dashboard'];
//     if (!authService.isAuthenticated() && protectedPaths.includes(location.pathname)) {
//       navigate('/login');
//     }
//   }, [location]);

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <div className="navbar-inner">
//           <Link to="/" className="navbar-brand">
//             Anime Recommender
//           </Link>

//           <div className="navbar-links">
//             <Link to="/" className="navbar-link">Home</Link>
//             <Link to="/categories" className="navbar-link">Categories</Link>
//             <Link to="/wishlist" className="navbar-link">Wishlist</Link>

//             {isAuth && (
//               <Link to="/dashboard" className="navbar-link">Dashboard</Link>
//             )}

//             {isAuth ? (
//               <button onClick={handleLogout} className="navbar-button" type="button">
//                 Logout
//               </button>
//             ) : (
//               <>
//                 <Link to="/login" className="navbar-link">Login</Link>
//                 <Link to="/register" className="navbar-link">Register</Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }