import React from 'react'
import AllClients from '../pages/client management/AllClients'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientDetails from '../pages/client management/ClientDetail';
import AllVenues from '../pages/venue management/AllVenues';
import VenueDetails from '../pages/venue management/VenueDetails';


const VenueManagementWrapper = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AllVenues />} />
        <Route path="/venue-detail/:venueId" element={<VenueDetails />} />
      </Routes>
    </>
  )
}
export default VenueManagementWrapper
