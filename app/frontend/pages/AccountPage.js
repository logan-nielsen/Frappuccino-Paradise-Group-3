import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Stack, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function isPositiveInteger(value) {
  return /^\d*$/.test(value);
}

export default function AccountPage() {
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [balance, setBalance] = useState()
  const [balanceIncrease, setBalanceIncrease] = useState("")

  useEffect(() => {
    // TODO: get name, email, and balance
    setName("Test Name")
    setEmail("test@example.com")
    setBalance(100)
  })

  function handleBalanceInput(event) {
    let value = event.target.value
    if (isPositiveInteger(value)) {
      if (value.charAt(0) == '0') {
        value = value.substring(1);
      }

      setBalanceIncrease(value)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Stack
          spacing={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography component="h2" variant = "h3">Account</Typography>
          <Typography variant="body1">Name: { name }</Typography>
          <Typography variant="body1">Email: { email }</Typography>
          <Typography variant="body1">Current Account Balance: { balance }</Typography>

          <Box 
            component="form" 
            maxWidth="200px"
            sx={{ mt: 1 }}
          >
            <TextField 
              id="balance_increase" 
              label="Amount"
              name="amount"
              placeholder='0'
              value={balanceIncrease}
              onChange={handleBalanceInput}
              required
            />
            <Button 
              id="add-balance-btn"
              variant="contained"
              fullWidth
              sx={{
                display: 'block', 
                mt: 2,
              }}
            >Add</Button>
          </Box>
        </Stack>
      </Container>
    </ThemeProvider>
  )
}
