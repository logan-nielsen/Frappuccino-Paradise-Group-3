import React, { useEffect, useState } from 'react';
import DrinkDialog from '../components/DrinkDialog';
import { Alert, Button, Grid, Snackbar } from '@mui/material';
import DrinkGridItem from '../components/DrinkGridItem';
import { Stack } from '@mui/system';
import ConfirmOrderDialog from '../components/ConfirmOrderDialog';

export default function OrderPage() {
  const [drinkDialogOpen, setDrinkDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [drinks, setDrinks] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState();
  const [order, setOrder] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState();

  useEffect(() => {
    fetch('api/getmenu/')
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar(json.error, true);
        }
        else {
          setDrinks(json);
        }
      })
      .catch((err) => {
        console.log(err)
        openSnackbar("Failed to retrieve menu", true);
      })
  }, [])

  useEffect(() => {
    console.log(order);
  }, [order])
  
  function addDrinkOrder(drinkOrder) {
    setOrder([...order, drinkOrder])
  }

  function deleteDrinkOrder(itemIndex) {
    let newOrder = structuredClone(order);
    newOrder = newOrder.filter((item, index) => index != itemIndex);
    setOrder(newOrder);
  }

  function placeOrder() {
    const formData = new FormData()
    formData.append(
      'csrfmiddlewaretoken',
      getCookie('csrftoken')
    )
    formData.append(
      'order',
      JSON.stringify(order)
    );

    fetch('api/placeorder/', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar(json.error, true);
        }
        else {
          openSnackbar("Successfully placed order")
        }
      })
      .catch((err) => {
        console.log(err)
        openSnackbar("Failed to place order", true);
      })

    setSelectedDrink(undefined);
    setOrder([])
  }

  function openSnackbar(message, error=false) {
    setSnackbarError(error);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
    setSnackbarMessage(undefined);
  }

  const drinkGridItems = drinks.map((drink, index) => 
    <DrinkGridItem 
      key={index} 
      drink={drink} 
      setSelectedDrink={setSelectedDrink}
      setDrinkDialogOpen={setDrinkDialogOpen}
    />
  )

  return (
    <>
    <Stack spacing={2}>
      <Button 
        variant="contained"
        onClick={() => setOrderDialogOpen(true)}
      >
        Place Order
      </Button>
      <Grid container spacing={2}>
        { drinkGridItems }
      </Grid>
    </Stack>

    <DrinkDialog 
      drink={selectedDrink}
      addDrinkOrder={addDrinkOrder}
      open={drinkDialogOpen} 
      setOpen={setDrinkDialogOpen} 
      openSnackbar={openSnackbar}
    />

    <ConfirmOrderDialog 
      open={orderDialogOpen}
      setOpen={setOrderDialogOpen}
      order={order}
      placeOrder={placeOrder}
      deleteDrinkOrder={deleteDrinkOrder}
    />

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
    >
      <Alert 
        onClose={handleSnackbarClose}
        severity={ snackbarError ? 'error' : 'success' }
      >
        { snackbarMessage }
      </Alert>
    </Snackbar>
    </>
  );
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