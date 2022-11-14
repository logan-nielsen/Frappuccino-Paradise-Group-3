import { Button, Grid, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';

export default function BuyInventory({ openSnackbar }) {
  const [inventory, setInventory] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    getInventory();
  }, []);

  useEffect(() => {
    let newCost = 0;
    inventory.forEach(element => {
      newCost += parseInt(element.number) * parseFloat(element.cost);
    })
    setTotalCost(newCost);
  }, [inventory]);

  function buyInventory() {
    // Check if anything is being added to the inventory
    let formData = new FormData();
    formData.append(
      'csrfmiddlewaretoken',
      getCookie('csrftoken')
    )
    formData.append(
      'cost',
      totalCost 
    )
    formData.append(
      'ingredients',
      JSON.stringify(inventory)
    )

    fetch('api/buyingredients/', {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar(json.error, true);
        }
        else {
          getInventory();
          openSnackbar("Successfully updated the inventory");
        }
      })
      .catch((err) => {
        console.log(err)
        openSnackbar("Failed to update inventory", true);
      })
  }

  function getInventory() {
    fetch('api/getingredients/')
      .then(response => response.json())
      .then(ingredients => {
        if (ingredients.error) {
          openSnackbar(ingredients.error, true);
        }
        else {
          ingredients.forEach(element => {
            element.number = 0;
          });
  
          setInventory(ingredients);
        }
      })
      .catch((err) => {
        console.log(err)
        openSnackbar("Failed to retrieve inventory", true);
      })
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
      setInventoryNumber(index, "0");
    }
    else if (isPositiveInteger(value) && parseInt(value) >= 0) {
      if (value.length > 1 && value.startsWith('0')) {
        value = value.slice(1);
      }
      
      setInventoryNumber(index, value);
    }
  }

  const inventoryItems = inventory.map((ingredient, index) => 
    <Grid item xs={4} key={index}>
      <TextField
        label={ingredient.name}
        type="number"
        value={ingredient.number}
        required
        error={ingredient.number === ""}
        onChange={event => handleInventoryInput(event, index)}
        helperText={`Current amount: ${ingredient.amountPurchased}`}
        sx={{ marginTop: "10px" }}
      />
    </Grid> 
  )
  
  return (
    <>
    <Typography variant="h4" gutterBottom>Buy Inventory</Typography>
    <p>Total Cost: ${totalCost.toFixed(2)}</p>
    <Stack spacing={2}>
      <Grid container spacing={2}>
        {inventoryItems}
      </Grid>
      <Button 
        variant="contained" 
        onClick={buyInventory}
        disabled={totalCost === 0}
        sx={{maxWidth: '200px'}}
      >
        Buy Inventory
      </Button>
    </Stack>
    </>
  );
}

function isPositiveInteger(value) {
  return /^[\d|e]*$/.test(value);
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