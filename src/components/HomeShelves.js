import { Stack, Paper, Typography } from "@mui/material";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HomeShelves = () => {
  const [ shelves, setShelves ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const getShelves = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('user_shelves').select(`
        id,
        title
      `).eq('user', user.id)
      .limit(2);
      setShelves(data || []);
      setLoading(false);
    };

    getShelves();
  }, [])

  if (loading) {
    return null;
  }

  return (
    <Stack spacing={1}>
      <Paper 
        sx={{height: 40, display: 'flex', alignItems: 'center', padding: "0 12px", justifyContent: 'center'}}
        onClick={() => navigate(`/library/all`)}
      >
        <Typography sx={{fontSize: 20}}>All Books</Typography>
      </Paper>
      {
        shelves.map(({id, title}) => (
          <Paper 
            key={id} 
            sx={{height: 40, display: 'flex', alignItems: 'center', padding: "0 12px", justifyContent: 'center'}}
            onClick={() => navigate(`/library/${id}`)}
          >
            <Typography sx={{fontSize: 20}}>{title}</Typography>
          </Paper>
        ))
      }
    </Stack>
  );
}

export default HomeShelves;