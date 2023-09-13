import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import { getCurrentUser } from '../services/authenticationService';
import { isSubmissionPresent } from '../services/studentSubmissionService';
import '../dragdrop.css'

const maxUploadSize = 100 * 1024 * 1024 //100mb

const ErrorTypography = styled(Typography)({
    color: 'red',
});

const DragDrop = () => {
    const token = getCurrentUser();
    const { id } = useParams();
    const [zipFile, setZipFile] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/assignment/${id}/get_submission`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 401) {
                    navigate("/login");
                }
                const data = await response.json();
                setSubmission(data);
            } catch (error) {
                console.error('Error fetching submission:', error);
            }
        };
    
        fetchData();
    }, [id]);

    useEffect(() => {
        if (isSubmissionPresent(submission)) {
            const fileContent = new Blob([submission.content])
            new File([fileContent], submission.fileName)
            setZipFile(submission)
        }
    }, [submission])

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
        fetch(`http://localhost:8080/api/v1/assignment/${id}/delete-submission`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .catch(error => {
                console.error('Error deleting assignment:', error);
            });
        setZipFile(null);
        window.location.reload();
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
                            {zipFile.name ? zipFile.name : zipFile.fileName}
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