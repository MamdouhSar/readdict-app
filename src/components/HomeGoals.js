import { Stack, Paper, Typography, LinearProgress, Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const HomeGoals = () => {
  const [ userGoal, setGoal ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const navigate = useNavigate();

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

  const getProgressPercentage = () => {
    const { progress, goal } = userGoal
    return Math.trunc((progress / goal) * 100);
  }

  if(!userGoal) {
    return (
      <Box sx={{height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
        <Button variant='contained' color="primary" fullWidth onClick={() => {navigate('/add-goal')}}>Add Goal</Button>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Paper sx={{padding: "16px 12px"}}>
        <Stack spacing={2}>
          <Typography sx={{fontSize: 16}}>Your 2023 Resolution</Typography>
          <Box>
            <LinearProgress value={getProgressPercentage()} variant="determinate" color="primary"/>
            <Typography sx={{fontSize: 12, color: "#49454F"}}>{userGoal.progress}/{userGoal.goal}</Typography>
          </Box>
        </Stack>
      </Paper>
      <Paper sx={{padding: "16px 12px"}}>
        <Typography sx={{fontSize: 16}}>Your Reading Streak</Typography>
        <Typography sx={{fontSize: 14, color: "#49454F"}}>{userGoal.streak} Days Streak</Typography>
      </Paper>
    </Stack>
  );
}

export default HomeGoals;