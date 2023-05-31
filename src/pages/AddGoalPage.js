import { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

const AddGoalPage = () => {
  const navigate = useNavigate();
  const [ goal, setGoal ] = useState(1);
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


  const handleGoalChange = (event) => {
    if(event.target.value) {
      setGoal(parseInt(event.target.value));
    } else {
      setGoal(event.target.value);
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('user_goals')
      .insert({ goal: goal, user: user.id, progress: 0, streak: 0 })
    setLoading(false);
    navigate('/');
  };

  return (
    <div>
      <Header 
        title={"Goal"} 
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
          <Typography sx={{fontSize: 20}}>How many books will you read this book?</Typography>
          <TextField type='number' inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} color="primary" label="Goal" value={goal} id="sign-up-goal" onChange={handleGoalChange} variant="outlined" fullWidth />
          <Button color="primary" variant="contained" fullWidth disabled={loading} onClick={handleSubmit}>Submit</Button>
        </Stack>
      </Box>
    </div>
  );
};

export default AddGoalPage;