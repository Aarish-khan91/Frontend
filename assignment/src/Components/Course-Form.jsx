import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, Stack } from '@mui/material';
import axios from 'axios';

function CourseForm() {
    const [title, setTitle] = useState('');
    const [courseCode, setCourseCode] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const courseData = {
            title,
            courseCode,
            description
        };

        try {
            const response = await axios.post('http://localhost:5050/api/courses', courseData);
            console.log('Course added successfully:', response.data);
            // Clear form fields after successful submission
            setTitle('');
            setCourseCode('');
            setDescription('');
            setError(null);
        } catch (err) {
            setError('Failed to add course. Please try again.');
            console.error('Error adding course:', err);
        }
    };

    return (
        <Box sx={{ width: '350px' }}>
            <FormControl fullWidth margin="normal">
                <Stack mb={1}>
                    <TextField
                        label="Course title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Stack>

                <Stack mb={1}>
                    <TextField
                        label="Course Code"
                        variant="outlined"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                    />
                </Stack>

                <Stack mb={1}>
                    <TextField
                        label="Course description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Stack>
            </FormControl>

            {error && (
                <Box sx={{ mb: 2, color: 'red', textAlign: 'center' }}>
                    {error}
                </Box>
            )}

            <Box sx={{ textAlign: 'center', textTransform: 'capitalize' }}>
                <Button
                    sx={{ textTransform: 'capitalize', bgcolor: '#1976d2' }}
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                >
                    Add course
                </Button>
            </Box>
        </Box>
    );
}

export default CourseForm;
