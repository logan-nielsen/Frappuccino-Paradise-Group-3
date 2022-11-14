import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Stack } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ConfirmOrderDialog({ open, setOpen, order, placeOrder, deleteDrinkOrder }) {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    let totalPrice = 0;
    for (order of order) {
      totalPrice += order.cost;
    }
    setPrice(totalPrice);
  }, [order])

  function handleClose() {
    setOpen(false)
  }

  function handleSubmit() {
    placeOrder()
    handleClose()
  }

  const orderItems = order.map((item, index) =>
    <Grid 
      key={index} 
      container 
      spacing={2}
    >
      <Grid item xs={1}>
        <IconButton 
          color="error"
          sx={{
            paddingTop: '0px'
          }}
          onClick={() => deleteDrinkOrder(index)}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
      <Grid item xs={11}>
        <Typography>{ item.drink.name }: { item.amount }</Typography>

        {/* List add ons dynamically */}
        {item.addOns.map((addOn, addOnIndex) => 
          <div key={addOnIndex} className='indented'>
            <Typography>{addOn.name}: {addOn.number}</Typography>
          </div>
        )}
      </Grid>
    </Grid>
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
          spacing={1}
          sx={{ width: '100%' }}
        >
          <Typography>Total Price: ${price.toFixed(2)}</Typography>
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