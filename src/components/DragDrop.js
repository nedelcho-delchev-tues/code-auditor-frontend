import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { getCurrentUser } from '../services/authenticationService';
import '../dragdrop.css'

const maxUploadSize = 100 * 1024 * 1024 //100mb

const ErrorTypography = styled(Typography)({
    color: 'red',
});

const DragDrop = () => {
    const { id } = useParams();
    const [zipFile, setZipFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const onDrop = (acceptedFiles, rejectedFiles) => {
        const validZipFiles = acceptedFiles.filter(file => file.type === 'application/zip');

        if (rejectedFiles.length > 0) {
            const errorFile = rejectedFiles[0];
            if (errorFile.size > maxUploadSize) {
                setErrorMessage('File size exceeds 100MB limit.');
            } else {
                setErrorMessage('Only 1 zip can be uploaded.');
            }
        } else if (validZipFiles.length > 0) {
            setErrorMessage('');
            setZipFile(validZipFiles[0]);

            const formData = new FormData();

            formData.append('file', validZipFiles[0]);

            const token = getCurrentUser();
            fetch(`http://localhost:8080/api/v1/assignment/${id}/submit-assignment`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                })
                .then(response => response.json())
                .catch(error => {
                    console.error('Error submitting assignment:', error);
                });
        }
    }

    const removeFile = () => {
        setZipFile(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/zip': ['.zip']
        },
        maxSize: 100 * 1024 * 1024, // 100MB limit
        maxFiles: 1, // Limit to one file
    });

    return (
        <Box className="dropzone-container">
            <Paper
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'active' : ''}`}
                sx={{
                    padding: '20px',
                    textAlign: 'center',
                    width: '50%',
                    height: '100%',
                    overflow: 'auto',
                }}
            >
                <input {...getInputProps()} />
                {errorMessage ? (
                    <ErrorTypography variant="body1" gutterBottom>
                        {errorMessage}
                    </ErrorTypography>
                ) : zipFile ? (
                    <div className="file-item">
                        <Typography variant="body1" gutterBottom>
                            {zipFile.name}
                        </Typography>
                        <IconButton variant="outlined" onClick={removeFile}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ) : isDragActive ? (
                    <Typography variant="body1" gutterBottom>
                        Drop the zip file here...
                    </Typography>
                ) : (
                    <Typography variant="body1" gutterBottom>
                        Drag & drop a zip file here, or click to select a file
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default DragDrop;