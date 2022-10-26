import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Stack } from '@mui/system';

let ingredientsInitialized = false;

export default function DrinkDialog({ drink, addDrinkOrder, open, setOpen }) {
  const [amount, setAmount] = useState(1);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch('api/getingredients/')
      .then(response => response.json())
      .then(allIngredients => {
        allIngredients.forEach(element => {
          element.number = 0;
        });

        setIngredients(allIngredients)
      })
  }, []);

  useEffect(() => {
    if (!ingredientsInitialized && drink && ingredients.length !== 0) {
      ingredientsInitialized = true;
      fetch(`api/getrecipe/?id=${drink.id}`)
        .then(response => response.json())
        .then(json => {
          let ingredientsCopy = structuredClone(ingredients)

          ingredientsCopy.forEach(ingredient => {
            json.forEach(recipeIngredient => {
              if (recipeIngredient.ingredient_id === ingredient.id) {
                ingredient.number = recipeIngredient.number;
              }
            })
          })

          setIngredients(ingredientsCopy)
        })
    }
  }, [drink, ingredients])

  function save() {
    addDrinkOrder({
      drink: drink,
      amount, amount
    })

    handleClose();
  }

  function handleClose() {
    setOpen(false);
    setAmount(1);
    ingredientsInitialized = false;
  }

  function setIngredientNumber(index, newNumber) {
    let newIngredients = [...ingredients];
    let ingredient = {...ingredients[index]};
    ingredient.number = newNumber;
    newIngredients[index] = ingredient
    setIngredients(newIngredients);
  }

  function handleAmountInput(event) {
    let value = event.target.value
		if (isPositiveInteger(value) && parseInt(value) > 0) {
		  setAmount(value)
		}
  }

  function handleIngredientInput(event, index) {
    let value = event.target.value
    if (isPositiveInteger(value) && parseInt(value) >= 0) {
      setIngredientNumber(index, value);
    }
  }

  const ingredientItem = ingredients.map((ingredient, index) => 
    <Grid item xs={6} key={index}>
      <TextField
        label={ingredient.name}
        type="number"
        value={ingredient.number}
        onChange={event => handleIngredientInput(event, index)}
        sx={{ marginTop: "10px" }}
      />
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
      <DialogTitle>{drink ? drink.name : ""}</DialogTitle>
      <DialogContent>
        <Stack 
          spacing={2}
          component="form" 
          noValidate 
          autoComplete="false" 
          sx={{ width: '100%' }}
        >
          <Typography>${drink ? drink.cost : ""}</Typography>
          <Grid container spacing={2}>
            {ingredientItem}
          </Grid>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountInput}
            sx={{ marginTop: "10px" }}
          />
          <Button
            onClick={save}
            variant="contained"
          >
            Submit
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
    </>
  );
}

function isPositiveInteger(value) {
  return /^\d*$/.test(value);
}