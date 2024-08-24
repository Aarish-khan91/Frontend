import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';

function CourseSelection() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get('http://localhost:5050/api/courses');
                setCourses(response.data);
            } catch (err) {
                setError('Failed to fetch courses. Please try again.');
                console.error('Error fetching courses:', err);
            }
        }
        fetchCourses();
    }, []);

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value); // Select course by its ID or code
    };

    const handleAddOrUpdateInstance = async () => {
        try {
            const instanceData = {
                year: parseInt(year, 10),
                semester: parseInt(semester, 10),
                courseId: selectedCourse // Use the selected course ID/code
            };

            // Fetch existing instances to check if this combination already exists
            const existingInstanceResponse = await axios.get(`http://localhost:5050/api/instances/${instanceData.year}/${instanceData.semester}`);
            const existingInstances = existingInstanceResponse.data;

            const existingInstance = existingInstances.find(instance => instance.courseId === instanceData.courseId);

            if (existingInstance) {
                // If instance exists, update it
                const updateResponse = await axios.put(`http://localhost:5050/api/instances/${existingInstance.id}`, instanceData);
                console.log('Instance updated successfully:', updateResponse.data);
            } else {
                // If instance does not exist, create a new one
                const createResponse = await axios.post('http://localhost:5050/api/instances', instanceData);
                console.log('Instance added successfully:', createResponse.data);
            }

            // Clear form fields after successful submission
            setSelectedCourse('');
            setYear('');
            setSemester('');
            setError(null);
        } catch (err) {
            setError('Failed to add or update instance. Please try again.');
            console.error('Error adding or updating instance:', err);
        }
    };

    return (
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', px: 2 }}>
            <FormControl fullWidth>
                <Stack direction={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'} gap={3} mb={2}>
                    <InputLabel id="course-select-label">Select Course</InputLabel>
                    <Select
                        labelId="course-select-label"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        sx={{
                            width: isMobile ? '100%' : '150px',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                        }}
                    >
                        {courses.map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                                {course.courseCode} - {course.title}
                            </MenuItem>
                        ))}
                    </Select>
                    <Box>
                        <Button 
                            variant='contained' 
                            sx={{ 
                                pt: 0, 
                                pb: 0, 
                                textTransform: 'capitalize',
                                width: isMobile ? '100%' : 'auto'
                            }}
                            onClick={() => window.location.reload()} // Simple refresh mechanism
                        >
                            Refresh
                        </Button>
                    </Box>
                </Stack>

                <Stack direction={isMobile ? 'column' : 'row'} gap={2}>
                    <TextField 
                        type='text' 
                        label='Year' 
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        sx={{ 
                            width: isMobile ? '100%' : '100px',
                            mb: isMobile ? 2 : 0
                        }} 
                    />
                    <TextField 
                        type='text' 
                        label='Semester' 
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        sx={{ 
                            width: isMobile ? '100%' : '150px' 
                        }} 
                    />
                </Stack>
            </FormControl>

            {error && (
                <Box sx={{ mb: 2, color: 'red', textAlign: 'center' }}>
                    {error}
                </Box>
            )}

            <Box mt={3} sx={{ textAlign: 'center' }}>
                <Button 
                    variant='contained' 
                    sx={{ textTransform: 'capitalize', width: isMobile ? '100%' : 'auto' }}
                    onClick={handleAddOrUpdateInstance}
                >
                    Add Instance
                </Button>
            </Box>
        </Box>
    );
}

export default CourseSelection;
