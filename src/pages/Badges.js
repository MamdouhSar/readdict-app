import { Stack, Paper, Typography, LinearProgress, Box, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Footer from "../components/Footer";

const badges = [{
  label: "Finish 1 Book",
  target: 1,
}, {
  label: "Finish 5 Books",
  target: 5,
}, {
  label: "Finish 10 Books",
  target: 10,
}, {
  label: "Finish 20 Books",
  target: 20,
}, {
  label: "Finish 50 Books",
  target: 50,
}, {
  label: "Finish 10 Books",
  target: 100,
}, {
  label: "Finish 200 Books",
  target: 200,
}, {
  label: "Finish 500 Books",
  target: 500,
}]

const Badges = () => {
  const [ userGoal, setGoal ] = useState({});
  const [ loading, setLoading ] = useState(true);
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

  useEffect(() => {
    setLoading(true);
    const getGoal = async () => {
      const { data: { user } } = await supabase.auth.getUser()
        const { data } = await supabase.from('user_goals').select(`
        id,
        goal,
        progress,
        streak
      `).eq('user', user.id).single();
      setGoal(data);
      setLoading(false);
    }

    getGoal();
  }, [])

  if(loading) {
    return null;
  }

  return (
    <div>
      <Header title={"Achievements"} />
      <Box sx={{padding: "8px 8px 100px 8px"}}>
        <Stack spacing={2}>
          <Paper sx={{padding: "16px 12px"}}>
            <Box sx={{display: 'flex', alignItem: 'center', justifyContent: 'center'}}>
              {userGoal && userGoal?.goal >= 0 ? 
                <Typography align="center" sx={{fontSize: 20}}>You have finished reading <b>{userGoal.progress}</b> books! Your goal was <b>{userGoal.goal}</b></Typography> :
                <Typography align="center" sx={{fontSize: 20}}>You have not added your goal yet!</Typography>
              } 
            </Box>
          </Paper>
          {
            userGoal && userGoal?.goal >= 0 ?
            <Box sx={{height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
              <Button variant='contained' color="primary" fullWidth onClick={() => {navigate('/edit-goal')}}>Edit Goal</Button>
            </Box> :
            <Box sx={{height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
              <Button variant='contained' color="primary" fullWidth onClick={() => {navigate('/add-goal')}}>Add Goal</Button>
            </Box>
          }
          <Typography sx={{fontSize: 22}}>Badges</Typography>
          <Grid container>
            {
              badges.map((badge, index) => {
                const sx = userGoal?.progress >= badge.target ? {
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  mr: 2,
                  ml: 2
                } : {
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: "#555",
                  mb: 2,
                  mr: 2,
                  ml: 2
                }
                return (
                  <Grid item xs={6} key={index}>
                    <Paper sx={sx}>
                      {badge.label}
                    </Paper>
                  </Grid>
                );
              })
            }
          </Grid>
        </Stack>
      </Box>
      <Footer/>
    </div>
  );
}

export default Badges;