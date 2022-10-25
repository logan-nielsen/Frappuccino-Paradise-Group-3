import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import SelectDrink from '../components/SelectDrink';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import SelectAddOns from '../components/SelectAddOns';
import { Stack } from '@mui/system';

const steps = ['Select Drink', 'Add Ons'];

export default function DrinkDialog({ drink, addDrinkOrder, open, setOpen }) {
  const [amount, setAmount] = useState(1);

  function save() {
    addDrinkOrder({
      drink: drink,
      amount, amount
    })

    handleClose();
  }

  function handleClose() {
    setOpen(false);
    setAmount(1);
  }

  function handleAmountInput(event) {
    let value = event.target.value
		if (isPositiveInteger(value) && parseInt(value) > 0) {
		  setAmount(value)
		}
  }

  return (
    <>
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{drink ? drink.name : ""}</DialogTitle>
      <DialogContent>
        <Stack 
          spacing={2}
          component="form" 
          noValidate 
          autoComplete="false" 
          sx={{ width: '100%' }}
        >
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountInput}
            sx={{ marginTop: "10px" }}
          />
          <Button
            onClick={save}
            variant="contained"
          >
            Submit
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
    </>
  );
}

function isPositiveInteger(value) {
  return /^\d*$/.test(value);
}