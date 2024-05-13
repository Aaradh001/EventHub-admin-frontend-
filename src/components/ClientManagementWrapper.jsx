import React from 'react'
import AllClients from '../pages/client management/AllClients'
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientDetails from '../pages/client management/ClientDetail';


const ClientManagementWrapper = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AllClients/>}/>
        <Route path="/client-detail/:clientId" element={<ClientDetails/>}/>
      </Routes>
    </>
  )
}
export default ClientManagementWrapper
