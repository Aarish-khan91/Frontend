import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

function CourseDetails() {
    const { id } = useParams(); // Get the course ID from the URL
    const [course, setCourse] = useState(null);
    const [instances, setInstances] = useState([]); // Store course instances

    useEffect(() => {
        fetchCourseDetails();
        fetchCourseInstances();
    }, [id]);

    const fetchCourseDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5050/api/courses/${id}`);
            setCourse(response.data);
        } catch (error) {
            console.error('Error fetching course details:', error);
        }
    };

    const fetchCourseInstances = async () => {
        try {
            // Fetch instances associated with the specific course ID
            const response = await axios.get(`http://localhost:5050/api/courses/${id}/instances`);
            setInstances(response.data);
        } catch (error) {
            console.error('Error fetching course instances:', error);
        }
    };

    if (!course) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {course.title}
                </Typography>
                <Typography variant="h6">
                    Course Code: {course.courseCode}
                </Typography>
                <Typography variant="body1">
                    Description: {course.description}
                </Typography>
            </Paper>

            {/* Displaying related course instances */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>
                    Course Delivery Instances
                </Typography>
                {instances.length > 0 ? (
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: '#5a80fb', color: 'white' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontSize: '1rem' }}>Year</TableCell>
                                    <TableCell sx={{ color: 'white', fontSize: '1rem' }}>Semester</TableCell>
                                    <TableCell sx={{ color: 'white', fontSize: '1rem' }}>Instance ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {instances.map((instance, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{instances.year}</TableCell>
                                        <TableCell>{instances.semester}</TableCell>
                                        <TableCell>{instances.id}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No instances available for this course.</Typography>
                )}
            </Paper>
        </Box>
    );
}

export default CourseDetails;
