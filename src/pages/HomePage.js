import { Box, Stack, Typography } from '@mui/material';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HomeSlider from '../components/HomeSlider';
import HomeGoals from '../components/HomeGoals';
import HomeShelves from '../components/HomeShelves';
import IconButton from '@mui/material/IconButton';
import PlusIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(!user) {
        navigate('/login')
      }
    }

    getUser();
  }, []);

  return (
    <div>
      <Header title={"ReAddict"}/>
      <Box sx={{padding: "8px 8px 100px 8px"}}>
        <Stack spacing={2}>
          <Box>
            <Stack spacing={2}>
              <Typography sx={{fontSize: 22}}>Currently Reading</Typography>
              <HomeSlider/>
            </Stack>
          </Box>
          <Box>
            <Stack spacing={2}>
              <Typography sx={{fontSize: 22}}>Your Goals</Typography>
              <HomeGoals/>
            </Stack>
          </Box>
          <Box>
            <Stack spacing={2}>
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Typography sx={{fontSize: 22}}>Your Shelves</Typography>
                <IconButton 
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  onClick={() => navigate('/add-shelf')}
                >
                  <PlusIcon/>
                </IconButton>
              </Box>
              <HomeShelves />
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Footer/>
    </div>
  );
};

export default HomePage;