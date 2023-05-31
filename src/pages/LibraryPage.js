import { Box, Paper, Stack, Typography } from '@mui/material';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import PlusIcon from '@mui/icons-material/Add';
import Footer from '../components/Footer';

const LibraryPage = () => {
  const navigate = useNavigate()
  const [ userShelves, setUserShelves] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(!user) {
        navigate('/login')
      }
    }

    getUser();
  }, []);

  useEffect(() => {
    setLoading(true);
    const getUserShelves = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userBooks } = await supabase.from('user_shelves').select(`
        id,
        title
      `)
      .eq('user', user.id);
      setUserShelves(userBooks);
      setLoading(false);
    }

    getUserShelves();
  }, [])

  if(loading) {
    return null;
  }

  return (
    <div>
      <Header title={"Library"} />
      <Box sx={{padding: "8px 8px 100px 8px"}}>
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
          <Stack spacing={1}>
            <Paper 
              sx={{height: 40, display: 'flex', alignItems: 'center', padding: "0 12px", justifyContent: 'center'}}
              onClick={() => navigate(`/library/all`)}
            >
              <Typography sx={{fontSize: 20}}>All Books</Typography>
            </Paper>
            {
              userShelves.map(({id, title}) => (
                <Paper 
                  key={id} 
                  sx={{height: 40, display: 'flex', alignItems: 'center', padding: "0 12px", justifyContent: 'center'}}
                  onClick={() => navigate(`/library/${id}`)}
                >
                  <Typography sx={{fontSize: 20}}>{title}</Typography>
                </Paper>
              ))
            }
          </Stack>
        </Stack>
      </Box>
      <Footer/>
    </div>
  );
};

export default LibraryPage;