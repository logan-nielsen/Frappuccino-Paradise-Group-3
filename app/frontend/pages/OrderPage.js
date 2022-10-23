import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DrinkDialog from '../components/DrinkDialog';
import { Button } from '@mui/material';

const steps = ['Select Drink', 'Add Ons', 'Confirm Order'];
const theme = createTheme();

export default function OrderPage() {
  const [drinkDialogOpen, setDrinkDialogOpen] = useState(false)
  const [drinks, setDrinks] = useState([])

  useEffect(() => {
    console.log(drinks)
  }, [drinks])

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }
  
  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function placeOrder() {
    console.log("order placed");
  }

  function addDrink(drink) {
    setDrinks([...drinks, drink])
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Button 
          variant="contained"
          onClick={() => setDrinkDialogOpen(true)}
        >
          Add Drink
        </Button>
        <DrinkDialog 
          addDrink={addDrink}
          open={drinkDialogOpen} 
          setOpen={setDrinkDialogOpen} 
        />
      </Container>
    </ThemeProvider>
  );
}