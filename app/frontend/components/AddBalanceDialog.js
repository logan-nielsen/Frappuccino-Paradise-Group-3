import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';

export default function AddBalanceDialog({ open, setOpen }) {

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
          method="post" 
          action="/api/increase-balance"
          width="100%"
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