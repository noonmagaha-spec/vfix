import React, { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { DataProvider } from "./contexts/DataContext";
import { useRole, RoleProvider } from "./contexts/RoleContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VehicleManagement from "./pages/VehicleManagement";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import SubmitRepairRequest from "./pages/SubmitRepairRequest";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { currentRole } = useRole();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Redirect to first allowed page when role changes
  React.useEffect(() => {
    const allowedPages = {
      Admin: "dashboard",
      Technician: "tickets",
      Driver: "driver-tickets",
    };

    const defaultPage = allowedPages[currentRole];
    if (currentPage !== defaultPage && currentPage !== "ticket-detail") {
      // Use setTimeout to defer state update and avoid cascading renders
      const timeoutId = setTimeout(() => {
        setCurrentPage(defaultPage);
        setSelectedTicketId(null);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole]);

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  const handleNavigate = (page: string) => {
    setSelectedTicketId(null);
    setCurrentPage(page);
  };

  const handleNavigateToTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setCurrentPage("ticket-detail");
  };

  const handleBackFromTicket = () => {
    const backPage = currentRole === "Driver" ? "driver-tickets" : "tickets";
    handleNavigate(backPage);
  };

  const renderPage = () => {
    if (currentPage === "ticket-detail" && selectedTicketId) {
      return (
        <TicketDetail
          ticketId={selectedTicketId}
          onBack={handleBackFromTicket}
        />
      );
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "vehicles":
        return <VehicleManagement />;
      case "tickets":
        return <TicketList onNavigateToDetail={handleNavigateToTicket} />;
      case "driver-tickets":
        return <TicketList onNavigateToDetail={handleNavigateToTicket} />;
      case "submit-repair":
        return <SubmitRepairRequest />;
      case "users":
        return <UserManagement />;
      case "reports":
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RoleProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
