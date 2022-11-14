import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, getMenuItemUtilityClass, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';

export default function DeleteDrinkDialog({ 
  open, 
  setOpen, 
  drink,
  openSnackbar, 
  getMenu,
}) {
  
  function handleClose() {
    setOpen(false);
  }

  function handleSubmit() {
    let formData = new FormData();
    formData.append(
      'csrfmiddlewaretoken',
      getCookie('csrftoken')
    )
    formData.append(
      'id',
      drink.id
    )

    fetch('api/removemenuitem/', {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar(json.error, true);
        }
        else {
          openSnackbar('Successfully deleted drink');
          setOpen(false);
          getMenu();
        }
      })
      .catch((err) => {
        console.log(err)
        openSnackbar("Failed to delete drink", true);
      })
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
      <DialogTitle>Delete {drink.name}</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this drink? This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          color="error"
          onClick={handleSubmit}
        >Delete Drink</Button>
      </DialogActions>
    </Dialog>
    </>
  )
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