import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';

const BookPage = () => {
  const navigate = useNavigate()
  const [ book, setBook ] = useState({});
  const [ loading, setLoading ] = useState(true);
  const { bookId } = useParams();

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
    const getUserBook = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: userBook } = await supabase.from('user_books').select(`
      id
      `)
      .eq('book_id', parseInt(bookId))
      .eq('user_id', user.id).single();
      if(userBook) {
        navigate(`/user-book/${userBook.id}`)
      }
    }

    getUserBook();
  }, [])

  useEffect(() => {
    setLoading(true);
    const getBook = async () => {
        const { data } = await supabase.from('books').select(`
        id,
        title,
        cover_image,
        author,
        pace,
        page_count,
        rating
      `).eq('id', parseInt(bookId)).single();
      setBook(data);
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

  const handleStartReading = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('user_books')
      .insert({ book_id: bookId, user_id: user.id })
      .select('id').single();
      navigate(`/user-book/${data.id}`);
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
            onClick={() => navigate(-1)}
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
                <img src={book.cover_image} alt={book.title} style={{width: '100%'}}/>
              </Box>
              <Box sx={{padding: '20px'}}>
                <Stack spacing={5}>
                  <Typography sx={{fontSize: 22}}>{book.title}</Typography>
                  <Typography>{book.author}</Typography>
                </Stack>
              </Box>
            </Box>
          </Paper>
          <Grid container>
            <Grid item xs={4}>
              <Paper sx={{padding: 1}}>
                <Stack>
                  <Typography align='center' sx={{fontSize: 16, color: '#79747E'}}>Rating</Typography>
                  <Typography align='center' sx={{fontSize: 14}}>{book.rating}</Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{padding: 1}}>
                <Stack>
                  <Typography align='center' sx={{fontSize: 16, color: '#79747E'}}>Pages</Typography>
                  <Typography align='center' sx={{fontSize: 14}}>{book.page_count}</Typography>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{padding: 1}}>
                <Stack>
                  <Typography align='center' sx={{fontSize: 16, color: '#79747E'}}>Pace</Typography>
                  <Typography align='center' sx={{fontSize: 14}}>{book.pace}</Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
          <Box>
            <Button color="primary" variant="contained" fullWidth onClick={handleStartReading}>Start Reading</Button>
          </Box>
        </Stack>
      </Box>
    </div>
  );
};

export default BookPage;