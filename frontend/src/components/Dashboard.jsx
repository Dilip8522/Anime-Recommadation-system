import React, { useEffect, useState } from 'react';   
import { animeApi } from '../services/api';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend,
  CartesianGrid, ResponsiveContainer
} from 'recharts';

const GenreAnalytics = ({ email }) => {
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const response = await animeApi.getUserGenreData(email);

        const maxCount = Math.max(...response.data.bar_chart.map(d => d.count));
        const maxRating = 10;

        const barPercentData = response.data.bar_chart.map(d => ({
          ...d,
          countPercent: ((d.count / maxCount) * 100).toFixed(1),
        }));

        const linePercentData = response.data.line_chart.map(d => ({
          ...d,
          averageRatingPercent: ((d.average_rating / maxRating) * 100).toFixed(1),
        }));

        setBarData(barPercentData);
        setLineData(linePercentData);
      } catch (err) {
        console.error('Error fetching genre data:', err);
      }
    };

    fetchGenreData();
  }, [email]);

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a28] text-cyan-400 p-2 rounded shadow-[inset_0_0_10px_#00ffff] font-semibold text-sm">
          {payload[0].payload.genre} : {payload[0].payload.countPercent}% of total count
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a28] text-cyan-400 p-2 rounded shadow-[inset_0_0_10px_#00ffff] font-semibold text-sm">
          {payload[0].payload.genre} : {payload[0].payload.averageRatingPercent}% of max rating
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0e0e1a] flex items-center justify-center py-12 px-4">
      <div
        className="
          w-full max-w-5xl space-y-12
          bg-[#141421] rounded-2xl
          shadow-neumorphic
          font-orbitron text-white select-none p-8
        "
      >
        <h2 className="text-3xl font-bold mb-4 text-cyan-400 text-center drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
          Genre Count (Bar Chart)
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222244" />
            <XAxis dataKey="genre" tick={{ fill: '#00ffff' }} />
            <YAxis
              tick={{ fill: '#00ffff' }}
              domain={[0, 100]}
              tickFormatter={(tick) => `${tick}%`}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Legend wrapperStyle={{ color: '#00ffff' }} />
            <Bar dataKey="countPercent" fill="#00ffff" radius={[15, 15, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <h2 className="text-3xl font-bold mb-4 text-cyan-400 text-center drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
          Average Rating by Genre (Line Chart)
        </h2>

        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222244" />
            <XAxis dataKey="genre" tick={{ fill: '#00ffff' }} />
            <YAxis
              tick={{ fill: '#00ffff' }}
              domain={[0, 100]}
              tickFormatter={(tick) => `${tick}%`}
            />
            <Tooltip content={<CustomLineTooltip />} />
            <Legend wrapperStyle={{ color: '#00ffff' }} />
            <Line
              type="monotone"
              dataKey="averageRatingPercent"
              stroke="#00ffff"
              strokeWidth={3}
              dot={{ r: 6, strokeWidth: 2, fill: '#00ffff' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        .shadow-neumorphic {
          box-shadow:
            10px 10px 20px #0a0a14,
            -10px -10px 20px #1e1e32;
        }
      `}</style>
    </div>
  );
};

export default GenreAnalytics;
