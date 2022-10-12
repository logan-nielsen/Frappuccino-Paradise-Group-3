import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function AccountPage() {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Typography component="h1" variant="h5">
          Name: 
        </Typography>
        <Typography component="h1" variant="h5">
          Email: 
        </Typography>
        <Typography component="h1" variant="h5">
          Password: 
        </Typography>
        <Typography component="h1" variant="h5">
          Fundz: 
        </Typography>
        <Button variant="outlined" fullWidth>
          Add $100.00
        </Button>
      </Container>
    </ThemeProvider>
  )
}
