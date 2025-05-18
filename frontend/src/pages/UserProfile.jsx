import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { animeApi, userApi } from '../services/api';

const UserProfile = () => {
  const token = localStorage.getItem('token');
  const [email, setEmail] = useState(null);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndGenreData = async () => {
      if (!token) {
        setError('Missing token in localStorage.');
        setLoading(false);
        return;
      }

      try {
        // Step 1: Get email from token via profile API
        const profileResponse = await userApi.getProfile(); // You should update this to just use token
        const userEmail = profileResponse.data?.email;

        if (!userEmail) throw new Error('Email not found in profile data');
        setEmail(userEmail);

        // Step 2: Get genre data using email + token
        const genreResponse = await animeApi.getUserGenreData(userEmail, token);
        setBarData(genreResponse.data.bar_chart);
        setLineData(genreResponse.data.line_chart);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user profile or genre data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndGenreData();
  }, [token]);

  if (loading) return <div className="text-center mt-8">Loading charts...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Your Anime Genre Insights</h2>

      <div className="mb-12">
        <h3 className="text-xl font-bold mb-4">Bar Chart: Genre Watch Count</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="genre" angle={-45} textAnchor="end" interval={0} height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Line Chart: Average Rating by Genre</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="genre" angle={-45} textAnchor="end" interval={0} height={80} />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="average_rating" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserProfile;



// import React, { useEffect, useState } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   LineChart, Line
// } from 'recharts';
// import { animeApi } from '../services/api';

// const UserProfile = () => {
//   const email = localStorage.getItem('email'); // Or use context/auth provider
//   const [barData, setBarData] = useState([]);
//   const [lineData, setLineData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchGenreData = async () => {
//       if (!email) {
//         setError('No email found in localStorage.');
//         return;
//       }
//       setLoading(true);
//       try {
//         const response = await animeApi.getUserGenreData(email);
//         setBarData(response.data.bar_chart);
//         setLineData(response.data.line_chart);
//       } catch (err) {
//         console.error(err);
//         setError('Failed to fetch genre data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGenreData();
//   }, [email]);

//   if (loading) return <div className="text-center mt-8">Loading charts...</div>;
//   if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-6">Your Anime Genre Insights</h2>

//       <div className="mb-12">
//         <h3 className="text-xl font-bold mb-4">Bar Chart: Genre Watch Count</h3>
//         <ResponsiveContainer width="100%" height={400}>
//           <BarChart data={barData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="genre" angle={-45} textAnchor="end" interval={0} height={80} />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count" fill="#4f46e5" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       <div>
//         <h3 className="text-xl font-bold mb-4">Line Chart: Average Rating by Genre</h3>
//         <ResponsiveContainer width="100%" height={400}>
//           <LineChart data={lineData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="genre" angle={-45} textAnchor="end" interval={0} height={80} />
//             <YAxis domain={[0, 10]} />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="average_rating" stroke="#10b981" />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
