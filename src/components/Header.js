import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ButtonAppBar({ title, leftIcon, rightIcon, noLeftIcon }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={0} color="secondary">
        <Toolbar>
          {
            leftIcon || 
            (noLeftIcon || <IconButton 
              size="large"
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={handleLogout}
            >
              <Logout/>
            </IconButton>)
          }
          <Typography variant="h6" align="center" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {rightIcon}
        </Toolbar>
      </AppBar>
    </Box>
  );
}