import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddBalanceDialog from '../components/AddBalanceDialog';

const theme = createTheme();

export default function AccountPage() {
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [balance, setBalance] = useState()
  const [addBalanceModalOpen, setAddBalanceModalOpen] = useState(false)
  const [hoursToAdd, setHoursToAdd] = useState("")

  useEffect(() => {
    // TODO: get name, email, and balance
    setName("Test Name")
    setEmail("test@example.com")
    setBalance(100)
  })

  function handleHoursInput(event) {
    let value = event.target.value
		if (isPositiveInteger(value)) {
		  if (value.charAt(0) == '0') {
			value = value.substring(1);
		  }
	
		  setHoursToAdd(value)
		}
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Box className='flex-container'>
          <Stack className='separated-flex-item' spacing={2}>
            <Typography component="h2" variant = "h3">Account</Typography>
            <Typography variant="body1">Name: { name }</Typography>
            <Typography variant="body1">Email: { email }</Typography>
            <Typography variant="body1">Current Account Balance: { balance }</Typography>

            <Button
              id="increase-balance-btn"
              variant="contained"
              onClick={() => setAddBalanceModalOpen(true)}
              sx={{
                maxWidth: "300px",
                display: 'block', 
                mt: 2,
              }}
            >
              Increase Account Balance
            </Button>
          </Stack>
          <Stack spacing={2}>
            <Typography component="h2" variant = "h3">Log Hours</Typography>
            <Box 
              component="form"
              method="post" 
              action="api/loghours/"
              width="100%"
              sx={{ mt: 1 }}
            >
              <input type="hidden"  name="csrfmiddlewaretoken" value={ getCookie('csrftoken') } />
              <TextField 
                id="add_hours" 
                label="Hours"
                name="hours"
                placeholder='0'
                value={hoursToAdd}
                onChange={handleHoursInput}
                required
              />
              <Button 
                id="add-hours-btn"
                variant="contained"
                type="submit"
                fullWidth
                sx={{
                  display: 'block', 
                  mt: 2,
                }}
              >Add</Button>
            </Box>
          </Stack>

        </Box>

        <AddBalanceDialog 
          open={addBalanceModalOpen} 
          setOpen={setAddBalanceModalOpen} 
        />
      </Container>
    </ThemeProvider>
  )
}

function isPositiveInteger(value) {
  return /^\d*$/.test(value);
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
