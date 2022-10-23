import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { Alert, Box, Snackbar, Stack, TextField } from '@mui/material';
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
  const [submitting, setSubmitting] = useState(false);
  const [payrollError, setPayrollError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState();
  const [isEmployee, setIsEmployee] = useState();


  useEffect(() => {
    fetch("api/isemployee/")
      .then(response => response.json())
      .then(json => setIsEmployee(json.is_employee))

    // TODO: get name, email, and balance
    setName("Test Name")
    setEmail("test@example.com")
    setBalance(100)
  }, [])

  function handleHoursInput(event) {
    let value = event.target.value
		if (isPositiveInteger(value)) {
		  if (value.charAt(0) == '0') {
			value = value.substring(1);
		  }
	
		  setHoursToAdd(value)
		}
  }

  function submitPayroll(e) {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData()
    formData.append(
      'csrfmiddlewaretoken',
      getCookie('csrftoken')
    )
    formData.append(
      'hours',
      hoursToAdd
    )

    fetch('api/loghours/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          setPayrollError(true);
          setSnackbarMessage("Failed to submit hours");
        }
        else {
          setSnackbarMessage("Hours Saved");
          setHoursToAdd("");
        }
        setSnackbarOpen(true);
      })
      .catch(() => {
        setPayrollError(true);
        setSnackbarMessage("Failed to submit hours");
      })
      .finally(() => setSubmitting(false))
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
    setSnackbarMessage(undefined);
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

          {/* Conditionally render the log hours section */}
          {isEmployee && 
            <Stack spacing={2}>
              <Typography component="h2" variant = "h3">Log Hours</Typography>
              <Box 
                component="form"
                onSubmit={submitPayroll}
                width="100%"
                sx={{ mt: 1 }}
              >
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
                  disabled={submitting}
                  sx={{
                    display: 'block', 
                    mt: 2,
                  }}
                >Add</Button>
              </Box>
            </Stack>
          }
        </Box>

        <AddBalanceDialog 
          open={addBalanceModalOpen} 
          setOpen={setAddBalanceModalOpen} 
        />

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert 
            onClose={handleSnackbarClose}
            severity={ payrollError ? 'error' : 'success' }
          >
            { snackbarMessage }
          </Alert>
        </Snackbar>
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
