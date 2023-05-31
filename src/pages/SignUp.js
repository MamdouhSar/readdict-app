import { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ passwordConfirmation, setPasswordConfirmation ] = useState('');
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if(user) {
        navigate('/')
      }
    }

    getUser();
  }, []);
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  }

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirmation(event.target.value);
  }

  const handleSubmit = async () => {
    setLoading(true);
    const { data: user, error: errorUser } = await supabase.auth.signUp({
      email,
      password,
    });

    const { error: errorUserProfile } = await supabase.from('user_profile').insert({
      first_name: firstName,
      last_name: lastName,
      user_id: user.id,
    });

    setLoading(false);
    if(!errorUser && !errorUserProfile) {
      navigate('/');
    }
  };

  return (
    <div>
      <Header title={"Sign Up"} noLeftIcon noRightIcon/>
      <Box sx={{padding: "8px"}}>
        <Stack spacing={2}>
          <TextField color="primary" label="First Name" value={firstName} id="sign-up-firstname" onChange={handleFirstNameChange} variant="outlined" fullWidth />
          <TextField color="primary" label="Last Name" value={lastName} id="sign-up-lastname" onChange={handleLastNameChange} variant="outlined" fullWidth />
          <TextField color="primary" label="Email" value={email} id="sign-up-email" onChange={handleEmailChange} variant="outlined" fullWidth />
          <TextField color="primary" label="Password" value={password} type="password" onChange={handlePasswordChange} id="sign-up-password" variant="outlined" fullWidth />
          <TextField 
            color="primary" label="Confirm Password" value={passwordConfirmation} onChange={handlePasswordConfirmChange} type="password" id="sign-up-password" variant="outlined" fullWidth 
          />
          <Button color="primary" variant="contained" fullWidth disabled={loading} onClick={handleSubmit}>Sign Up</Button>
          <Button color="primary" onClick={() => {navigate('/login')}} fullWidth>You have an account? Login</Button>
        </Stack>
      </Box>
    </div>
  );
};

export default SignUp;