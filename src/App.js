import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import BookReadingPage from './pages/BookReadingPage';
import BookPage from './pages/BookPage';

import AddGoalPage from './pages/AddGoalPage';
import SearchPage from './pages/SearchPage';
import AddNewShelf from './pages/AddNewShelf';
import LibraryPage from './pages/LibraryPage';
import LibraryShelfPage from './pages/LibraryShelfPage';
import Badges from './pages/Badges';
import EditGoalPage from './pages/EditGoalPage';


const theme = createTheme({
  palette: {
    primary: {
      main: '#6750A4'
    },
    secondary: {
      main: '#fff',
      contrastText: '#000'
    },
    background: {
      paper: '#FEF7FF'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route index element={<HomePage/>}/>
        <Route path="user-book/:bookId" element={<BookReadingPage/>}/>
        <Route path="library" element={<LibraryPage/>}/>
        <Route path="library/:shelfId" element={<LibraryShelfPage/>}/>
        <Route path="add-goal" element={<AddGoalPage/>}/>
        <Route path="edit-goal" element={<EditGoalPage/>}/>
        <Route path="add-shelf" element={<AddNewShelf/>}/>
        <Route path="search" element={<SearchPage/>}/>
        <Route path="book/:bookId" element={<BookPage/>}/>
        <Route path="badges" element={<Badges />} />
        <Route path="login" element={<Login/>}/>
        <Route path="sign-up" element={<SignUp/>}/>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
