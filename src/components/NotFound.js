import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFoundPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: (theme) => theme.palette.grey[200],
            }}
        >
            <Container
                sx={{
                    padding: 3,
                    borderRadius: '10px',
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                }}
            >
                <ErrorOutlineIcon
                    sx={{
                        fontSize: '3rem',
                        color: '#FF5733',
                    }}
                />
                <Typography variant="h4" sx={{ margin: 2, color: '#555555' }}>
                    404
                </Typography>
                <Typography variant="subtitle1">Упс! Страницата не е намерана.</Typography>
                <Button
                    sx={{
                        marginTop: 2,
                        color: '#ffffff',
                        backgroundColor: '#3498db',
                        '&:hover': {
                            backgroundColor: '#2980b9',
                        }
                    }}
                    variant="contained"
                    onClick={() => window.location.href = '/dashboard'}
                >
                    Върни ме обратно
                </Button>
            </Container>
        </Box>
    );
}