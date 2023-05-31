import { useEffect, useState, forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Box, Grid, Paper, Stack } from '@mui/material';
import { supabase } from '../supabaseClient';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddBookToShelfDialog({
  open,
  onClose,
  currentShelfBooks,
  shelfIdentifier
}) {
  const [ books, setBooks ] = useState([]);

  useEffect(() => {
    const getBooks = async () => {
      const currentBooksIds = currentShelfBooks.map((book) => book.book_id.id);
      const { data } = await supabase.from('books').select(`
        id,
        title,
        cover_image,
        author,
        pace,
        page_count,
        rating
      `);
      const booksToAdd = data?.filter((book) => !currentBooksIds.includes(book.id)) || []
      setBooks(booksToAdd);
    }

    getBooks();
  }, []);

  const handleClose = () => {
    onClose()
  };

  const handleAddToShelf = (id) => async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: userBook } = 
        await supabase
          .from('user_books')
          .select('id').eq("user_id", user.id).eq("book_id", id).limit(1).single();
    if(shelfIdentifier !== 'all') {
      if(userBook) {
        await supabase.from('user_books').update({ shelf: shelfIdentifier}).eq('id', userBook.id);
      } else {
        await supabase
          .from('user_books')
          .insert({ book_id: parseInt(id), user_id: user.id, shelf: parseInt(shelfIdentifier) });
      }
    } else {
      await supabase
      .from('user_books')
      .insert({ book_id: parseInt(id), user_id: user.id });
    }
    onClose();
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Add Book To Shelf
          </Typography>
        </Toolbar>
      </AppBar>
      <Stack spacing={2}>
        {books.map(({id, title, cover_image, author}) => {
          return (
            <Paper key={id}>
              <Box sx={{display: 'flex', height: 90, width: '100%'}}>
                <Box sx={{width: 80}}>
                  <img src={cover_image} alt={title} style={{width: '100%', height: '100%'}}/>
                </Box>
                <Box sx={{padding: '20px', width: '100%'}}>
                  <Grid container>
                    <Grid item xs={7}>
                      <Stack spacing={1}>
                        <Typography sx={{fontSize: 12}}>{title}</Typography>
                        <Typography sx={{fontSize: 10}}>{author}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={5}>
                      <Button color="primary" onClick={handleAddToShelf(id)}>Add To Shelf</Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Stack>
    </Dialog>
  );
}