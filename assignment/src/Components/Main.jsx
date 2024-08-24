import React, { useState, useEffect } from 'react';
import CourseSelection from './Course-selection';
import CoursesList from './Courses-List';
import CourseForm from './Course-Form';
import Box from '@mui/material/Box';
import { Divider, Stack } from '@mui/material';
import axios from 'axios';

function Main() {
    const [courses, setCourses] = useState([]);

    // Function to fetch courses from the backend
    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5050/api/courses');
            setCourses(response.data); // Update courses state with the fetched data
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    // Fetch courses when the component mounts
    useEffect(() => {
        fetchCourses();
    }, []);

    // Function to refresh courses list after a new course is added
    const handleCourseAdded = () => {
        fetchCourses();
    };

    return (
        <Box sx={{ p: 2 }}>
            <Stack direction='row' alignItems='center' gap={{ xs: 10, md: 20 }}>
                {/* Pass the handleCourseAdded callback to CourseForm */}
                <CourseForm onCourseAdded={handleCourseAdded} />
                <CourseSelection />
            </Stack>

            <Divider sx={{ mt: 1, border: '1px solid #e0e0e0' }} />

            <Box sx={{ pl: { xs: 0, md: 30 } }}>
                {/* Pass the courses data to CoursesList */}
                <CoursesList courses={courses} />
            </Box>
        </Box>
    );
}

export default Main;
