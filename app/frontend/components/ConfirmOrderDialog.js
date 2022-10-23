import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Stack } from '@mui/system';

const steps = ['Select Drink', 'Add Ons'];

export default function ConfirmOrderDialog({ open, setOpen, order, placeOrder }) {

  function handleClose() {
    setOpen(false)
  }

  function handleSubmit() {
    placeOrder()
    handleClose()
  }

  const orderItems = order.map((drink, index) => 
    <Typography key={index}>{ drink.name }: { drink.amount }</Typography>
  )

  return (
    <>
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Confirm Order</DialogTitle>
      <DialogContent>
        <Stack 
          spacing={2}
          sx={{ width: '100%' }}
        >
          { orderItems }
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} autoFocus>Place Order</Button>
      </DialogActions>
    </Dialog>
    </>
  );
}