import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, getMenuItemUtilityClass, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';

export default function AddDrinkDialog({ 
  open, 
  setOpen, 
  ingredientsList, 
  openSnackbar, 
  getMenu 
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState([]);
  
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  useEffect(() => {
    setIngredients(structuredClone(ingredientsList));
  }, [ingredientsList])
  
  function handleSubmit() 
  {
    // error handling
    let error = false;
    if (name == "") {
      setNameError(true);
      error = true;
    }
    if (price == "" || !isValidMoneyFinal(price)) {
      setPriceError(true);
      error = true;
    }
    if (error) {
      return;
    }

    // submit form
    let formData = new FormData();
    formData.append(
      'csrfmiddlewaretoken',
      getCookie('csrftoken')
    )
    formData.append(
      'name',
      name
    )
    formData.append(
      'price',
      price
    )
    formData.append(
      'ingredients',
      JSON.stringify(ingredients)
    )

    fetch('api/addmenuitem/', {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar(json.error, true);
        }
        else {
          openSnackbar('Successfully created drink');
          getMenu();
          handleClose();
        }
      })
      .catch((err) => {
        console.log(err)
        openSnackbar("Failed to create drink", true);
      })
  }

  function handleClose() {
    setOpen(false);
  }

  function handleNameInput(event) {
    let value = event.target.value;
    setName(value);
  }

  function handlePriceInput(event) {
    let value = event.target.value;
    
    if (!value) {
      setPrice("");
    }
    else if (isValidMoneyInput(value)) {
      if (value.length > 1 && value.startsWith('0')) {
        value = value.slice(1);
      }
      
      setPrice(value);
    }
  }
  
  function handleIngredientInput(event, index) {
    let value = event.target.value;
    
    if (!value) {
      setIngredientNumber(index, "");
    }
    else if (isPositiveInteger(value) && parseInt(value) >= 0) {
      if (value.length > 1 && value.startsWith('0')) {
        value = value.slice(1);
      }
      
      setIngredientNumber(index, value);
    }
  }

  function setIngredientNumber(index, newNumber) {
    let newIngredients = [...ingredients];
    let ingredient = {...ingredients[index]};
    ingredient.number = newNumber;
    newIngredients[index] = ingredient;

    setIngredients(newIngredients);
  }

  const ingredientItems = ingredients.map((ingredient, index) => 
    <Grid item xs={6} key={index}>
      <TextField
        label={ingredient.name}
        type="number"
        value={ingredient.number}
        required
        error={ingredient.number === ""}
        onChange={event => handleIngredientInput(event, index)}
        sx={{ marginTop: "10px" }}
      />
    </Grid> 
  );
  
  return (
    <>
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Create Drink</DialogTitle>
      <DialogContent>
        <Stack 
          spacing={2}
          sx={{ width: '100%' }}
        >
          <TextField
            value={name}
            required
            label="Name"
            error={nameError}
            onChange={event => handleNameInput(event)}
            sx={{ marginTop: "10px" }}
          />
          <TextField
            value={price}
            required
            label="Price"
            placeholder="0"
            error={priceError}
            onChange={event => handlePriceInput(event)}
            sx={{ marginTop: "10px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
          <Grid container spacing={2}>
            {ingredientItems}
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          autoFocus
        >Create Drink</Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

function isValidMoneyInput(value) {
  return /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{0,2})?$/.test(value);
}

function isValidMoneyFinal(value) {
  return /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/.test(value);
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