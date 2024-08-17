import React from 'react'
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VendorDetails from '../pages/vendor management/VendorDetail';
import AllVendors from '../pages/vendor management/AllVendors';


const VendorManagementWrapper = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AllVendors/>}/>
        <Route path="/vendor-detail/:vendorId" element={<VendorDetails/>}/>
      </Routes>
    </>
  )
}
export default VendorManagementWrapper
