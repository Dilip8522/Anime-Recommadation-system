import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WishlistPage from './pages/WishlistPage';
import CategoriesPage from './pages/CategoryPage';
import AnimeDetails from './pages/AnimeDetails';
// import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from "./components/Footer";
import DashboardPage from "./pages/DashboardPage";
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/anime/:id" element={<AnimeDetails />} />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            /> */}
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </div>
      </Router>
      <Footer />
    </AuthProvider>
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import WishlistPage from './pages/WishlistPage'; 
// // import Recommendations from './pages/Recommendations';
// import CategoriesPage from './pages/CategoryPage';
// import { authService } from './services/auth';
// import AnimeDetails from './pages/AnimeDetails';
// import UserProfile from './pages/UserProfile';
// // Protected Route component
// const ProtectedRoute = ({ children }) => {
//   if (!authService.isAuthenticated()) {
//     return <Navigate to="/login" />;
//   }
//   return children;
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-gray-100">
//           <Navbar />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             {/* <Route 
//               path="/recommendations" 
//               element={
//                 <ProtectedRoute>
//                   <Recommendations />
//                 </ProtectedRoute>
//               } 
//             /> */}
//             <Route path="/categories" element={<CategoriesPage />} />
//             <Route path="/anime/:id" element={<AnimeDetails />} />
//             <Route path="/wishlist" element={<WishlistPage />} />
//             <Route path="/profile" element={<UserProfile />} />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App; 