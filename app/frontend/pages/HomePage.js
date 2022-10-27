import * as React from 'react';
import Typography from '@mui/material/Typography';
import Copyright from '../components/Copyright';
import HomeImage from '../images/homeImage.jpg';
import { Stack } from '@mui/system';

export default function HomePage() {
  return (
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
  );
}
