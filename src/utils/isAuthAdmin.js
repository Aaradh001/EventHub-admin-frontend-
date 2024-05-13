import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { BASE_URL } from "../constants/constants";

const baseURL = BASE_URL;

const updateAdminToken = async () => {
  const refreshToken = localStorage.getItem("refresh");

  try {
    const res = await axios.post(baseURL + "token/refresh-token/", {
      refresh: refreshToken,
    });

    if (res.status === 200) {
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// const fetchisAdmin = async (token) => {

//   try {
//     const res = await axios.get(baseURL + "/api/accounts/user/details/", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//     });
//     return res.data.is_superadmin; // Return directly from the function
//   } catch (error) {
//     return false;
//   }
// };

const isAuthAdmin = async () => {
  const accessToken = localStorage.getItem("access");
  
  if (!accessToken) {
    return { name: null, isAuthenticated: false, isAdmin: false};
  }
  
  const currentTime = Date.now() / 1000;
  let decoded = jwtDecode(accessToken);
  if (decoded.exp > currentTime) {
    // let checkAdmin = await fetchisAdmin(accessToken); // Await the result
    return {
      name: decoded.username,
      isAuthenticated: true,
      isAdmin: decoded.user_role === 'ADMIN',
    };
  } else {
    const updateSuccess = await updateAdminToken();

    if (updateSuccess) {
      let decoded = jwtDecode(accessToken);
      // let checkAdmin = await fetchisAdmin(); // Await the result
      return {
        name: decoded.username,
        isAuthenticated: true,
        isAdmin: decoded.user_role === 'ADMIN',
      };
    } else {
      return { name: null, isAuthenticated: false, isAdmin: false };
    }
  }
};

export default isAuthAdmin;