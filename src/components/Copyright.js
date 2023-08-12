import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            style={{
                position: 'absolute',
                bottom: 0,
                width: '50%',
                padding: '10px'
            }}
            {...props}
        >
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Code Auditor
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright;