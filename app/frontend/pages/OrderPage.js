import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DrinkDialog from '../components/DrinkDialog';
import { Button, Grid } from '@mui/material';
import DrinkGridItem from '../components/DrinkGridItem';
import { Stack } from '@mui/system';
import ConfirmOrderDialog from '../components/ConfirmOrderDialog';

const theme = createTheme();

export default function OrderPage() {
  const [drinkDialogOpen, setDrinkDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [drinks, setDrinks] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState();
  const [order, setOrder] = useState([])

  useEffect(() => {
    fetch('api/getmenu/')
      .then(response => response.json())
      .then(allDrinks => {
        setDrinks(allDrinks)
      })
  }, [])
  
  function addDrinkOrder(drinkOrder) {
    setOrder([...order, drinkOrder])
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

    setSelectedDrink(undefined);
    setOrder([])
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
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />

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
        />

        <ConfirmOrderDialog 
          open={orderDialogOpen}
          setOpen={setOrderDialogOpen}
          order={order}
          placeOrder={placeOrder}
        />
      </Container>
    </ThemeProvider>
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