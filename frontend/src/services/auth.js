import { jwtDecode } from 'jwt-decode';

export const authService = {
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },

  getUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }
};


// import { jwtDecode } from 'jwt-decode';

// export const authService = {
//   setToken: (token) => {
//     localStorage.setItem('token', token);
//   },

//   getToken: () => {
//     return localStorage.getItem('token');
//   },

//   removeToken: () => {
//     localStorage.removeItem('token');
//   },

//   isAuthenticated: () => {
//     const token = localStorage.getItem('token');
//     if (!token) return false;
    
//     try {
//       const decoded = jwtDecode(token);
//       return decoded.exp > Date.now() / 1000;
//     } catch {
//       return false;
//     }
//   },

//   getUser: () => {
//     const token = localStorage.getItem('token');
//     if (!token) return null;
    
//     try {
//       return jwtDecode(token);
//     } catch {
//       return null;
//     }
//   }
// }; 