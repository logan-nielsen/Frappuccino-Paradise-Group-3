import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
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

  const orderItems = order.map((item, index) =>
    <Box key={index}>
      <Typography>{ item.drink.name }: { item.amount }</Typography>

      {/* List add ons dynamically */}
      {item.addOns.map((addOn, addOnIndex) => 
        <div key={addOnIndex} className='indented'>
          <Typography>{addOn.name}: {addOn.number}</Typography>
        </div>
      )}
    </Box>
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

          {/* Display a message if no drinks have been added to the order */}
          { !order.length && 
            <Typography>You haven't added anything to your order</Typography>
          }
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          autoFocus
          disabled={!order.length}
        >Place Order</Button>
      </DialogActions>
    </Dialog>
    </>
  );
}