import { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const next = searchParams.get('next');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(user) {
        navigate('/')
      }
    }

    getUser();
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleSubmit = async () => {
    setLoading(true);
    const { error: errorUser } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);
    if(!errorUser) {
      navigate(next || '/');
    }
  };

  return (
    <div>
      <Header title={"Login"} noLeftIcon noRightIcon/>
      <Box sx={{padding: "8px"}}>
        <Stack spacing={2}>
          <TextField color="primary" label="Email" value={email} id="sign-up-email" onChange={handleEmailChange} variant="outlined" fullWidth />
          <TextField color="primary" label="Password" value={password} type="password" onChange={handlePasswordChange} id="sign-up-password" variant="outlined" fullWidth />
          <Button color="primary" variant="contained" fullWidth disabled={loading} onClick={handleSubmit}>Login</Button>
          <Button color="primary" onClick={() => {navigate('/sign-up')}} fullWidth>You do not have an account? Sign up!</Button>
        </Stack>
      </Box>
    </div>
  );
};

export default Login;