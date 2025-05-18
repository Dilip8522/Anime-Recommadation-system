import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const isAuth = authService.isAuthenticated();

  const handleLogout = () => {
    authService.removeToken();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            Anime Recommender
          </Link>

          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Home
            </Link>

            <Link to="/categories" className="navbar-link">
              Categories
            </Link>

            <Link to="/wishlist" className="navbar-link">
              Wishlist
            </Link>

            {isAuth && (
              <Link to="/profile" className="navbar-link">
                User Profile
              </Link>
            )}

            {isAuth ? (
              <button
                onClick={handleLogout}
                className="navbar-button"
                type="button"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
                <Link to="/register" className="navbar-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


// import { useNavigate, Link } from 'react-router-dom';
// import { authService } from '../services/auth';
// import '../styles/Navbar.css';

// export default function Navbar() {
//   const navigate = useNavigate();
//   const isAuth = authService.isAuthenticated();

//   const handleLogout = () => {
//     authService.removeToken();
//     navigate('/login', { replace: true });
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <div className="navbar-inner">
//           <Link to="/" className="navbar-brand">
//             Anime Recommender
//           </Link>

//           <div className="navbar-links">
//             <Link to="/" className="navbar-link">
//               Home
//             </Link>

//             <Link to="/categories" className="navbar-link">
//               Categories
//             </Link>

//             <Link to="/wishlist" className="navbar-link">
//               Wishlist
//             </Link>
//             {/* <Link to="/login" className="navbar-link">
//                   Login
//             </Link>
//             <Link to="/register" className="navbar-link">
//                   Register
//             </Link> */}

//             {isAuth ? (
//               <>
//                 {/* Future feature */}
//                 {/* <Link to="/recommendations" className="navbar-link">
//                   Recommended
//                 </Link> */}
//                 <button
//                   onClick={handleLogout}
//                   className="navbar-button"
//                   type="button"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className="navbar-link">
//                   Login
//                 </Link>
//                 <Link to="/register" className="navbar-link">
//                   Register
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
