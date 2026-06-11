// ============================================================
// V-FIX — Layout Component
// AppBar + Sidebar navigation + Content area
// ============================================================

import React, { useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import RoleSwitcher from "./RoleSwitcher";
import { useRole } from "../contexts/RoleContext";
import type { Role } from "../types";

const DRAWER_WIDTH = 260;

// ─── Navigation items with role-based visibility ────────────
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "ภาพรวม (Dashboard)",
    icon: <DashboardIcon />,
    roles: ["Admin"],
  },
  {
    id: "vehicles",
    label: "จัดการยานพาหนะ",
    icon: <DirectionsCarIcon />,
    roles: ["Admin"],
  },
  {
    id: "tickets",
    label: "รายการแจ้งซ่อม",
    icon: <ListAltIcon />,
    roles: ["Admin", "Technician"],
  },
  {
    id: "driver-tickets",
    label: "คำขอแจ้งซ่อมของฉัน",
    icon: <ListAltIcon />,
    roles: ["Driver"],
  },
  {
    id: "submit-repair",
    label: "แจ้งซ่อมรถใหม่",
    icon: <BuildCircleIcon />,
    roles: ["Driver"],
  },
  {
    id: "users",
    label: "จัดการผู้ใช้งาน",
    icon: <PeopleIcon />,
    roles: ["Admin"],
  },
];

interface LayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  currentPage,
  onNavigate,
  children,
}) => {
  const { currentRole } = useRole();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(currentRole),
  );

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo area */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            background: "linear-gradient(135deg, #2E86DE 0%, #6C5CE7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(46,134,222,0.3)",
          }}
        >
          <BuildCircleIcon sx={{ color: "white", fontSize: 26 }} />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#2D3436",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            V-FIX
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#B2BEC3", fontWeight: 500, fontSize: "0.65rem" }}
          >
            ระบบแจ้งซ่อมรถยนต์
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {filteredNavItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  onNavigate(item.id);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2.5,
                  py: 1.2,
                  px: 2,
                  transition: "all 0.2s ease",
                  backgroundColor: isActive
                    ? "rgba(46,134,222,0.08)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "rgba(46,134,222,0.12)"
                      : "rgba(0,0,0,0.03)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "#2E86DE" : "#B2BEC3",
                    transition: "color 0.2s",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      style: {
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#2E86DE" : "#636E72",
                      },
                    },
                  }}
                />
                {isActive && (
                  <Box
                    sx={{
                      width: 4,
                      height: 24,
                      borderRadius: 2,
                      backgroundColor: "#2E86DE",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom brand */}
      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "0.7rem" }}
        >
          © 2024 V-FIX System v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#F0F4F8" }}
    >
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background:
            "linear-gradient(135deg, #2E86DE 0%, #4A90D9 50%, #6C5CE7 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                display: { xs: "none", sm: "block" },
              }}
            >
              V-FIX
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.7)",
                display: { xs: "none", lg: "block" },
                ml: 1,
              }}
            >
              ระบบแจ้งซ่อมและจัดการยานพาหนะ
            </Typography>
          </Box>
          <RoleSwitcher />
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              border: "none",
              boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              border: "none",
              boxShadow: "2px 0 16px rgba(0,0,0,0.04)",
              backgroundColor: "#FFFFFF",
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: "64px",
          minHeight: "calc(100vh - 64px)",
          maxWidth: "100%",
        }}
      >
        <Box sx={{ maxWidth: 1600, mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
