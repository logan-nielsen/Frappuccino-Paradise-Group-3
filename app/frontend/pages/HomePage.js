import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Copyright from '../components/Copyright';
import HomeImage from '../images/homeImage.jpg';
import { Stack } from '@mui/system';
  
const theme = createTheme();

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Stack
          spacing={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h2" variant="h3">Dan's Frappuccino Paradise</Typography>
          <img src={HomeImage} height="400px" />
          <Typography variant="body1">Voted as the best coffe shop in Logan 10,000 years in a row in our completely unbiased survey!</Typography>
          <Typography variant="body1">"Easily the best frappuccinos I've had in town" - Dan Watson</Typography>
          
          <Copyright sx={{ mt: 5 }} />
        </Stack>
      </Container>
    </ThemeProvider>
  );
  }
