// ============================================================
// V-FIX — Role Switcher Component
// Persistent UI to switch between Admin / Technician / Driver
// ============================================================

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EngineeringIcon from '@mui/icons-material/Engineering';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import type { Role } from '../types';
import { useRole } from '../contexts/RoleContext';

const roleIcons: Record<Role, React.ReactNode> = {
  Admin: <AdminPanelSettingsIcon fontSize="small" />,
  Technician: <EngineeringIcon fontSize="small" />,
  Driver: <DirectionsCarIcon fontSize="small" />,
};

const roleLabels: Record<Role, string> = {
  Admin: 'ผู้ดูแลระบบ',
  Technician: 'ช่างซ่อม',
  Driver: 'พนักงานขับรถ',
};

const roleColors: Record<Role, string> = {
  Admin: '#6C5CE7',
  Technician: '#0984E3',
  Driver: '#00B894',
};

const RoleSwitcher: React.FC = () => {
  const { currentRole, currentUser, switchRole } = useRole();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (role: Role) => {
    switchRole(role);
    handleClose();
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          py: 0.5,
          px: 1.5,
          borderRadius: 3,
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        }}
      >
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: roleColors[currentRole],
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
        >
          {currentUser.name.charAt(0)}
        </Avatar>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.2 }}>
            {currentUser.name}
          </Typography>
          <Chip
            icon={<Box sx={{ color: 'inherit', display: 'flex', ml: 0.5 }}>{roleIcons[currentRole]}</Box>}
            label={roleLabels[currentRole]}
            size="small"
            sx={{
              height: 20,
              mt: 0.3,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.65rem',
              '& .MuiChip-icon': { color: 'inherit' },
            }}
          />
        </Box>
        <KeyboardArrowDownIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 20 }} />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary">
            สลับตำแหน่ง (Switch Role)
          </Typography>
        </Box>
        {(['Admin', 'Technician', 'Driver'] as Role[]).map((role) => (
          <MenuItem
            key={role}
            onClick={() => handleSelect(role)}
            selected={currentRole === role}
            sx={{
              py: 1.5,
              mx: 1,
              my: 0.5,
              borderRadius: 2,
              '&.Mui-selected': {
                backgroundColor: `${roleColors[role]}15`,
                '&:hover': {
                  backgroundColor: `${roleColors[role]}25`,
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: roleColors[role] }}>
              {roleIcons[role]}
            </ListItemIcon>
            <ListItemText
              primary={roleLabels[role]}
              slotProps={{
                primary: { style: { fontWeight: currentRole === role ? 700 : 500 } },
              }}
            />
            {currentRole === role && (
              <Chip label="เลือกใช้งาน" size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: `${roleColors[role]}20`, color: roleColors[role] }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default RoleSwitcher;
