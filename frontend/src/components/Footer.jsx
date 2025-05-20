import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0f0f1a] text-white text-center py-4 w-full">
      <p>&copy; {new Date().getFullYear()} Anime Recommender. All rights reserved.</p>
    </footer>
  );
};

export default Footer;


// import React from "react";
// import "../styles/Footer.css";

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <p>&copy; {new Date().getFullYear()} Anime Recommender. All rights reserved.</p>
//     </footer>
//   );
// };

// export default Footer;
