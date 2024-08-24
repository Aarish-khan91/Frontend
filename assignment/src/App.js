import logo from './logo.svg';
// import './App.css';
import CourseForm from './Components/Course-Form';
import Box from '@mui/material/Box';
import { Divider, Stack } from '@mui/material';
import CoursesList from './Components/Courses-List';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Main from './Components/Main';

function App() {
  return (
    <Router>
    
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/courses" element={<CoursesList />} />
      </Routes>
    </Router>
  );
}

export default App;
