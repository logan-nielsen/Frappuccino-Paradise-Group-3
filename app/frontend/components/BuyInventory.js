import { Button, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function BuyInventory() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetch('api/getingredients')
      .then(response => response.json())
      .then(ingredients => {
        ingredients.forEach(element => {
          element.number = 0;
        });

        setInventory(ingredients);
      })
  }, []);

  function buyInventory() {
    console.log(inventory);
  }

  function setInventoryNumber(index, newNumber) {
    let newInventory = [...inventory];
    let ingredient = {...inventory[index]};
    ingredient.number = newNumber;
    newInventory[index] = ingredient
    setInventory(newInventory);
  }

  function handleInventoryInput(event, index) {
    let value = event.target.value;
    
    if (!value) {
      setInventoryNumber(index, "");
    }
    else if (isPositiveInteger(value) && parseInt(value) >= 0) {
      if (value.length > 1 && value.startsWith('0')) {
        value = value.slice(1);
      }
      
      setInventoryNumber(index, value);
    }
  }

  const inventoryItem = inventory.map((ingredient, index) => 
    <Grid item xs={4} key={index}>
      <TextField
        label={ingredient.name}
        type="number"
        value={ingredient.number}
        required
        error={ingredient.number === ""}
        onChange={event => handleInventoryInput(event, index)}
        sx={{ marginTop: "10px" }}
      />
    </Grid> 
  )
  
  return (
    <>
    <Typography variant="h4" gutterBottom>Buy Inventory</Typography>
    <Grid container spacing={2}>
      {inventoryItem}
    </Grid>
    <Button 
        variant="contained" 
        onClick={buyInventory}
        sx={{maxWidth: '200px'}}
      >
        Buy Inventory
      </Button>
    </>
  );
}

function isPositiveInteger(value) {
  return /^[\d|e]*$/.test(value);
}