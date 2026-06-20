// ============================================================
// V-FIX — Login Page
// Login form with authentication
// ============================================================

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(username, password);
    
    if (!success) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Logo and Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #2E86DE 0%, #6C5CE7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
                boxShadow: '0 8px 24px rgba(46,134,222,0.4)',
              }}
            >
              <BuildCircleIcon sx={{ color: 'white', fontSize: 48 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#2D3436',
                mb: 0.5,
                letterSpacing: '-0.02em',
              }}
            >
              V-FIX
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#636E72', fontWeight: 500 }}
            >
              ระบบแจ้งซ่อมรถยนต์
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="ชื่อผู้ใช้"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              margin="normal"
              required
              autoFocus
              disabled={isLoading}
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  sx: {
                    borderRadius: 2,
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="รหัสผ่าน"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              margin="normal"
              required
              disabled={isLoading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                  },
                },
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #2E86DE 0%, #6C5CE7 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2570C4 0%, #5A4FD0 100%)',
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'เข้าสู่ระบบ'
              )}
            </Button>
          </Box>

          {/* Demo Credentials Info */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              backgroundColor: '#F8F9FA',
              borderRadius: 2,
              border: '1px dashed #B2BEC3',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: '#636E72', fontWeight: 600, display: 'block', mb: 1 }}
            >
              ข้อมูลการทดสอบ (Demo Credentials):
            </Typography>
            <Typography variant="caption" sx={{ color: '#636E72', display: 'block' }}>
              • Admin: admin-vfix / Vfix123456
            </Typography>
            <Typography variant="caption" sx={{ color: '#636E72', display: 'block' }}>
              • ช่าง: tech01-vfix / Vfix123456
            </Typography>
            <Typography variant="caption" sx={{ color: '#636E72', display: 'block' }}>
              • พนักงานขับรถ: driver01-vfix / Vfix123456
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
