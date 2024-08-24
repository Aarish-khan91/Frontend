import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, IconButton, Stack, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CoursesList() {
    const location = useLocation();
    const pathName = location.pathname;
    const navigate = useNavigate();
    const [semesters, setSemesters] = useState([]);
    const [courses, setCourses] = useState([]); // Ensure this is initialized as an empty array
    const [filterYear, setFilterYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]); // Ensure this is initialized as an empty array

    useEffect(() => {
        // Initially load all courses or any default state
        fetchCourses();
    }, [pathName]);

    const deleteCourse = async (id) => {
        try {
            await axios.delete(`http://localhost:5050/api/courses/${id}`);
            // Update the state to remove the deleted course from both courses and filteredCourses
            setCourses((prevCourses) => prevCourses.filter(course => course.id !== id));
            setFilteredCourses((prevFiltered) => prevFiltered.filter(course => course.id !== id));
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5050/api/courses');
            setCourses(response.data);
            setFilteredCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleFilter = async () => {
        if (filterYear && selectedSemester) {
            try {
                const response = await axios.get(`http://localhost:5050/api/instances/${filterYear}/${selectedSemester}`);
                setFilteredCourses(response.data);
            } catch (error) {
                console.error('Error fetching filtered courses:', error);
            }
        } else {
            setFilteredCourses(courses); // Reset to all courses if no filter is applied
        }
    };

    useEffect(() => {
        fetchSemesters();
    }, []);

    const fetchSemesters = async () => {
        try {
            const response = await axios.get('http://localhost:5050/api/instances');
            const courseInstances = response.data;

            const uniqueSemesters = [...new Set(courseInstances.map(instance => instance.semester))];
            setSemesters(uniqueSemesters);
        } catch (error) {
            console.error('Error fetching course instances:', error);
        }
    };

    return (
        <Box sx={{ p: 1 }}>
            {pathName === '/courses' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                    <Stack direction='row' gap={3}>
                        <TextField
                            type='text'
                            label='Year'
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            sx={{
                                width: '150px',
                                mb: 0
                            }}
                        />
                        <FormControl sx={{ width: '170px' }}>
                            <InputLabel id="semester-select-label">Select Semester</InputLabel>
                            <Select
                                labelId="semester-select-label"
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                            >
                                {semesters.map((semester, index) => (
                                    <MenuItem key={index} value={semester}>{semester}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <Box sx={{ textAlign: 'center' }}>
                        <Button variant='contained' sx={{ textTransform: 'capitalize' }} onClick={handleFilter}>
                            List instances
                        </Button>
                    </Box>
                </Box>
            )} {pathName === '/' && (
                <Box sx={{ textAlign: 'center' }}>
                    <Button variant='contained' sx={{ textTransform: 'capitalize' }} onClick={() => navigate('/courses')}>List courses</Button>
                </Box>
            )}

            <TableContainer component={Paper} sx={{ mt: 1, width: '100%', overflowX: 'auto' }}>
                <Table sx={{ borderCollapse: 'collapse' }}>
                    <TableHead sx={{ bgcolor: '#5a80fb', color: 'white' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontSize: '1rem', border: '1px solid #e0e0e0' }}>Course Title</TableCell>
                            {pathName === '/courses' && <TableCell sx={{ color: 'white', fontSize: '1rem', border: '1px solid #e0e0e0' }}>Year-Sem</TableCell>}
                            <TableCell sx={{ color: 'white', fontSize: '1rem', border: '1px solid #e0e0e0' }}>Code</TableCell>
                            <TableCell sx={{ color: 'white', fontSize: '1rem', border: '1px solid #e0e0e0' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(filteredCourses) && filteredCourses.length > 0 ? (
                            filteredCourses.map((course, index) => (
                                course && (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            backgroundColor: index % 2 === 1 ? '#f5f5f5' : 'white',
                                            height: 'auto',
                                            fontSize: '1rem',
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell sx={{ border: '1px solid #e0e0e0' }}>{course.title}</TableCell>
                                        {pathName === '/courses' && course.courseInstances && course.courseInstances.year !== undefined && (
                                            <TableCell sx={{ border: '1px solid #e0e0e0' }}>{course.courseInstances.year}-{course.courseInstances.semester}</TableCell>
                                        )}
                                        <TableCell sx={{ border: '1px solid #e0e0e0', width: '150px' }}>{course.courseCode}</TableCell>
                                        <TableCell sx={{ border: '1px solid #e0e0e0', width: '150px' }}>
                                            <IconButton color="primary" size="small" onClick={() => alert('This feature will coming soon') }>
                                                <SearchIcon sx={{ bgcolor: 'black', p: '2px', borderRadius: '5px', color: 'white' }} fontSize="small" />
                                            </IconButton>

                                            <IconButton color="error" size="small" onClick={() => deleteCourse(course.id)}>
                                                <DeleteIcon sx={{ color: 'black' }} fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={pathName === '/courses' ? 4 : 3} sx={{ textAlign: 'center', border: '1px solid #e0e0e0' }}>
                                    No courses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default CoursesList;
