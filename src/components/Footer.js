import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SearchIcon from '@mui/icons-material/Search';
import BadgesIcon from '@mui/icons-material/MilitaryTech';
import { useLocation, useNavigate } from 'react-router-dom';
import { Paper } from '@mui/material';

const pathMap = {
  "/": 0,
  "/library": 1,
  "/search": 2,
  "/badges": 3,
}

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value] = React.useState(pathMap[location.pathname]);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 412}} elevation={3}>
      <BottomNavigation
        showLabels
        sx={{ maxWidth: 412 }} 
        value={value}
        color="primary"
      >
        <BottomNavigationAction color="primary" onClick={() => {navigate('/')}} label="Home" icon={<HomeIcon fontSize='small' />} />
        <BottomNavigationAction color="primary" onClick={() => {navigate('/library')}}  label="Library" icon={<LibraryBooksIcon fontSize='small' />} />
        <BottomNavigationAction color="primary" onClick={() => {navigate('/search')}} label="Search" icon={<SearchIcon fontSize='small' />} />
        <BottomNavigationAction color="primary" onClick={() => {navigate('/badges')}} label="Badges" icon={<BadgesIcon fontSize='small' />} />
      </BottomNavigation>
    </Paper>
  );
}