import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Campaigns from "../pages/Campaigns";
import CampaignDetails from "../pages/CampaignDetails";
import Dashboard from "../pages/Dashboard";
import Auth from "../pages/Auth";
import CreateCampaign from "../pages/CreateCampaign";
import Donate from "../pages/Donate";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/campaign/:id" element={<CampaignDetails />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/create-campaign"
        element={
          <ProtectedRoute>
            <CreateCampaign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donate"
        element={
          <ProtectedRoute>
            <Donate />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
