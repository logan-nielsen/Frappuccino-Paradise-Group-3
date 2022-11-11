import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';

export default function AddBalanceDialog({ open, setOpen, addBalance, newSnackbar }) {

  const [balanceIncrease, setBalanceIncrease] = useState("")
	
  function handleBalanceInput(event) {
		let value = event.target.value
		if (isPositiveInteger(value)) {
		  if (value.charAt(0) == '0') {
			value = value.substring(1);
		  }
	
		  setBalanceIncrease(value)
		}
	}

	function handleClose() {
		setOpen(false)
	}

  function submitBalanceIncrease(e) {
    e.preventDefault()

    const formData = new FormData()
    formData.append(
      'csrfmiddlewaretoken',
      getCookie('csrftoken')
    );
    formData.append(
      'amount',
      balanceIncrease
    )

    fetch('api/addcredit/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          newSnackbar("")
        }
        else {
          addBalance(balanceIncrease)
          newSnackbar("Balance Increase Added")
          setBalanceIncrease("")
        }
      })
      .finally(() => {
        setOpen(false)
      })
  }

	return (
		<Dialog
		  open={open}
		  onClose={handleClose}
		  fullWidth
		  maxWidth="xs"
		>
			<DialogTitle>Increase Account Balance</DialogTitle>
      <DialogContent>
        <Box 
          component="form"
          onSubmit={submitBalanceIncrease}
          width="100%"
          sx={{ mt: 1 }}
        >
          <TextField 
            id="balance_increase" 
            label="Amount"
            name="amount"
            placeholder='0'
            required
            autoFocus
            value={balanceIncrease}
            onChange={handleBalanceInput}
          />
          <Button 
            id="add-balance-btn"
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              display: 'block', 
              mt: 2,
            }}
          >Add</Button>
        </Box>
      </DialogContent>
		</Dialog>
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