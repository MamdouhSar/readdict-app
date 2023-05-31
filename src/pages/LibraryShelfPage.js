import { Box, Button, CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import IconButton from '@mui/material/IconButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import AddBookToShelfDialog from '../components/AddBookToShelfDialog';

const LibraryShelfPage = () => {
  const navigate = useNavigate();
  const [ openDialog, setOpenDialog ] = useState(false);
  const [ userBooks, setUserBooks] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const { shelfId } = useParams();

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
    const getUserBooks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if(shelfId === 'all') {
        const { data: userBooks } = await supabase.from('user_books').select(`
          id,
          progress,
          book_id:books (
            id,
            title,
            author,
            rating,
            cover_image,
            page_count
          )
        `)
        .eq('user_id', user.id);
        setUserBooks(userBooks || []);
      } else {
        const { data: userBooks } = await supabase.from('user_books').select(`
          id,
          progress,
          book_id:books (
            id,
            title,
            author,
            rating,
            cover_image,
            page_count
          )
        `)
        .eq('user_id', user.id)
        .eq('shelf', parseInt(shelfId));
        setUserBooks(userBooks || []);
      }
      setLoading(false);
    }

    getUserBooks();
  }, [openDialog])

  if(loading) {
    return null;
  }

  const getProgress = (userProgress, pageCount) => {
    return Math.trunc((userProgress / pageCount) * 100);
  }

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
      <AddBookToShelfDialog shelfIdentifier={shelfId} currentShelfBooks={userBooks} open={openDialog} onClose={() => {setOpenDialog(false)}}/>
      <Box sx={{padding: "8px 8px 100px 8px"}}>
        <Stack spacing={2}>
          <Button variant="contained" color="primary" fullWidth onClick={() => setOpenDialog(true)}>Add New Book To Shelf</Button>
          {userBooks.map(({id, progress, book_id}) => {
            return (
              <Box sx={{height: 90}} key={id} onClick={() => {navigate(`/user-book/${id}`)}}>
                <Paper>
                  <Box sx={{display: 'flex', height: 90, width: '100%'}}>
                    <Box sx={{width: 80}}>
                      <img src={book_id.cover_image} alt={book_id.title} style={{width: '100%', height: '100%'}}/>
                    </Box>
                    <Box sx={{padding: '20px', width: '100%'}}>
                      <Grid container>
                        <Grid item xs={7}>
                          <Stack spacing={1}>
                            <Typography sx={{fontSize: 12}}>{book_id.title}</Typography>
                            <Typography sx={{fontSize: 10}}>{book_id.author}</Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item xs={4}>
                          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress color="primary" variant="determinate" value={getProgress(progress, book_id.page_count)}/>
                            <Box
                              sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography variant="caption" component="div">
                                {progress}
                              </Typography>
                            </Box>
                          </Box>
                          </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </Stack>
      </Box>
      <Footer/>
    </div>
  );
};

export default LibraryShelfPage;