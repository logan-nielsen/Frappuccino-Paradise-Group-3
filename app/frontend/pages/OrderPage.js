import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DrinkDialog from '../components/DrinkDialog';
import { Button, Fab, Grid } from '@mui/material';
import DrinkGridItem from '../components/DrinkGridItem';
import { Stack } from '@mui/system';
import ConfirmOrderDialog from '../components/ConfirmOrderDialog';

const theme = createTheme();

export default function OrderPage() {
  const [drinkDialogOpen, setDrinkDialogOpen] = useState(false);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [drinks, setDrinks] = useState(["drink 1", "drink 2", "drink 3"]);
  const [selectedDrink, setSelectedDrink] = useState();
  const [order, setOrder] = useState([])
  
  function addDrinkOrder(drinkOrder) {
    setOrder([...order, drinkOrder])
  }

  function placeOrder() {
    // TODO: Place order on server
    console.log("order placed")

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
            Order
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