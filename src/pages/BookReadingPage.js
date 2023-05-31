import { Box, Button, Grid, Paper, Slider, Stack, Typography } from '@mui/material';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

const BookReadingPage = () => {
  const [ book, setBook ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const [ userProgress, setUserProgress ] = useState(0);
  const { bookId } = useParams();
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
    const getBook = async () => {
      const { data } = await supabase.from('user_books').select(`
        id,
        progress,
        finished,
        book_id:books (
          id,
          title,
          cover_image,
          author,
          pace,
          page_count,
          rating
        )
      `).eq('id', parseInt(bookId)).single();
      setBook(data);
      setUserProgress(data.progress);
      setLoading(false);
    }
    getBook();
  }, []);

  if(loading) {
    return null;
  }

  if(!book) {
    return null;
  }

  const handleChangeCommitted = async (event, value) => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase
      .from('user_books')
      .update({ progress: value, finished: value === book.book_id.page_count })
      .eq('id', parseInt(bookId)); 
    if(value === book.book_id.page_count) {
      const { data: userGoal } = await supabase.from('user_goals').select('id, progress').eq('user', user.id).limit(1).single();
      if(userGoal) {
        await supabase.from('user_goals').update({ progress: userGoal.progress + 1 }).eq('id', userGoal.id);
      }
    }
  }

  const handleProgressChange = (event, newValue) => {
    setUserProgress(newValue);
  }

  const handleReadAgain = async () => {
    const { data } = await supabase
      .from('user_books')
      .update({ progress: 0, finished: false})
      .eq('id', parseInt(bookId)).select(`
        id,
        progress,
        finished,
        book_id:books (
          id,
          title,
          cover_image,
          author,
          pace,
          page_count,
          rating
        )
      `).single(); 
    setBook(data);
    setUserProgress(0);
  }

  return (
    <div>
      <Header 
        title={"Reading"} 
        leftIcon={
          <IconButton 
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate('/')}
          >
            <ArrowBack/>
          </IconButton>
        }
      />
      <Box sx={{padding: "8px"}}>
        <Stack spacing={2}>
          <Paper>
            <Box sx={{display: 'flex'}}>
              <Box sx={{width: '35%'}}>
                <img src={book.book_id.cover_image} alt={book.book_id.title} style={{width: '100%'}}/>
              </Box>
              <Box sx={{padding: '20px'}}>
                <Stack spacing={5}>
                  <Typography sx={{fontSize: 22}}>{book.book_id.title}</Typography>
                  <Typography>{book.book_id.author}</Typography>
                </Stack>
              </Box>
            </Box>
          </Paper>
          <Grid container>
            <Grid item xs={4}>
              <Paper sx={{padding: 1}}>
                <Stack>
                  <Typography align='center' sx={{fontSize: 16, color: '#79747E'}}>Rating</Typography>
                  <Typography align='center' sx={{fontSize: 14}}>{book.book_id.rating}</Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{padding: 1}}>
                <Stack>
                  <Typography align='center' sx={{fontSize: 16, color: '#79747E'}}>Pages</Typography>
                  <Typography align='center' sx={{fontSize: 14}}>{book.book_id.page_count}</Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{padding: 1}}>
                <Stack>
                  <Typography align='center' sx={{fontSize: 16, color: '#79747E'}}>Pace</Typography>
                  <Typography align='center' sx={{fontSize: 14}}>{book.book_id.pace}</Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          {
            book.finished ? 
              <Button onClick={handleReadAgain} color="primary" fullWidth variant="contained">Read Again</Button> : 
              <Box sx={{display: 'flex', alignItems: 'center', padding: "0 8px"}}>
                <Box sx={{width: '80%'}}>
                  <Slider color="primary" max={book.book_id.page_count} min={0} value={userProgress} onChangeCommitted={handleChangeCommitted} onChange={handleProgressChange} />
                </Box>
                <Box sx={{width: '20%'}}>
                  <Typography align='center' sx={{fontSize: 14}}>{userProgress}</Typography>
                </Box>
              </Box>
          }
        </Stack>
      </Box>
    </div>
  );
};

export default BookReadingPage;