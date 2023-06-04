import { Box, Paper, LinearProgress, Stack, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function HomeSlider() {
  const [ books, setBooks ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const getBooks = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('user_books').select(`
        id,
        progress,
        book_id:books (
          id,
          title,
          cover_image,
          page_count
        )
      `).eq('user_id', user.id).eq('finished', false).gt('progress', 0);
      setBooks(data);
      setLoading(false);
    };

    getBooks();
  }, [])

  if (loading) {
    return null;
  }


  if(!books || books?.length <= 0) {
    return (
      <Box sx={{height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}} >
        <Button variant='contained' color="primary" fullWidth onClick={() => {navigate('/search')}}>Add New Book</Button>
      </Box>
    )
  }

  const settings = {
    slidesToShow: books.length > 1 ? 2 : 1,
    infinite: true,
    arrows: false,
  };

  const getProgress = (userProgress, pageCount) => {
    return Math.trunc((userProgress / pageCount) * 100);
  }

  return (
    <Slider {...settings}>
      {
        books.map(({id, progress, book_id}) => (
          <Box sx={{maxWidth: 160}} key={id} onClick={() => {navigate(`/user-book/${id}`)}}>
            <Stack spacing={2}>
              <Paper sx={{
                backgroundImage: `url(${book_id.cover_image})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat', 
                backgroundPosition: 'center',
                height: 140
              }} />
              <LinearProgress value={getProgress(progress, book_id.page_count)} variant="determinate" color="primary"/>
            </Stack> 
          </Box>
        ))
      }
    </Slider>
  );
}