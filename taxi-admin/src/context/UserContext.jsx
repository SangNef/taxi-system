// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getProfile } from "~/api/auth";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => { 
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const response = await getProfile(token);
//           setUser(response.metadata);
//         } catch (error) {
//           console.error("Failed to fetch profile:", error);
//         }
//       }
//     };

//     fetchProfile();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => {
//   return useContext(UserContext);
// };
