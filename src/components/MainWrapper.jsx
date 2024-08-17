import React, { useEffect } from "react";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { set_Authentication } from "../redux/authentication/authenticationSlice";

import isAuthAdmin from "../utils/isAuthAdmin";
import PrivateRoute from "./privateRoute/PrivateRoute";
import ClientManagementWrapper from "./ClientManagementWrapper"
import Login from "../pages/common/Login";
import Dashboard from "../pages/common/Dashboard";

import {BASE_URL} from "../constants/constants"
import Layout from "./Layout";
import NotFoundPage from "./NotFoundPage";
import 'react-toastify/dist/ReactToastify.css';
import VenueManagementWrapper from "./VenueManagementWrapper";
import VendorManagementWrapper from "./VendorManagementWrapper";


function MainWrapper() {
  const dispatch = useDispatch();
  const authentication_user = useSelector((state) => state.authentication_user);

  const baseURL = BASE_URL;
  const token = localStorage.getItem("access");

  const checkAuthAndFetchUserData = async () => {
    try {
      const isAuthenticated = await isAuthAdmin();
      dispatch(
        set_Authentication({
          name: isAuthenticated.name,
          isAuthenticated: isAuthenticated.isAuthenticated,
          isAdmin: isAuthenticated.isAdmin,
        })
      );

      // if (isAuthenticated.isAuthenticated) {
      //   const res = await axios.get(baseURL + "/admin-control/user/details/", {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //     },
      //   });
      //   console.log('the user response is', res);

      //   dispatch(
      //     set_user_basic_details({
      //       name: res.data.first_name,
      //       profile_pic: res.data.profile_pic,
      //     })
      //   );
      // }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!authentication_user.name) {
      checkAuthAndFetchUserData();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* <Header/> */}
      <Routes>
        <Route path="login" element={<Login/>}/>
        <Route path="/" element={<PrivateRoute><Layout/></PrivateRoute>}>
          <Route index element={<Dashboard/>}/>
          <Route path="client-management/*" element={<ClientManagementWrapper/>}/>
          <Route path="vendor-management/*" element={<VendorManagementWrapper/>}/>
          <Route path="venue-management/*" element={<VenueManagementWrapper/>}/>
        </Route>
        <Route path="*" element={<NotFoundPage/>}/>
        
      {/* Custom 404 page */}
      </Routes>
    </>
  );
}

export default MainWrapper;