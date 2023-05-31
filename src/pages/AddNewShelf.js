import { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

const AddNewShelf = () => {
  const navigate = useNavigate();
  const [ shelf, setShelf ] = useState("");
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(!user) {
        navigate('/login')
      }
    }

    getUser();
  }, []);


  const handleShelfChange = (event) => {
    setShelf(event.target.value);
  }

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('user_shelves')
      .insert({ title: shelf, user: user.id})
    setLoading(false);
    navigate(-1);
  };

  return (
    <div>
      <Header 
        title={"Shelf"} 
        leftIcon={
          <IconButton 
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate(-1)}
          >
            <ArrowBack/>
          </IconButton>
        }
      />
      <Box sx={{padding: "22px 24px"}}>
        <Stack spacing={2}>
          <Typography sx={{fontSize: 20}}>Add new shelf to sort out your books</Typography>
          <TextField color="primary" label="Shelf Title" value={shelf} id="sign-up-shelf" onChange={handleShelfChange} variant="outlined" fullWidth />
          <Button color="primary" variant="contained" fullWidth disabled={loading} onClick={handleSubmit}>Submit</Button>
        </Stack>
      </Box>
    </div>
  );
};

export default AddNewShelf;