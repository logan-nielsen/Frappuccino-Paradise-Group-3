import { Button, Dialog, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";

export default function MenuIngredientsDialog({
  index,
  open, 
  setOpen, 
  drink,
  setDrinkIngredients,
}) {
  const [ingredients, setIngredients] = useState([]);
  
  useState(() => {
    setIngredients(structuredClone(drink.ingredients));
  }, [drink])

  function setIngredientNumber(index, newNumber) {
    let newIngredients = [...ingredients];
    let ingredient = {...ingredients[index]};
    ingredient.number = newNumber;
    newIngredients[index] = ingredient;

    setIngredients(newIngredients);
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
  
  function handleClose() {
    setIngredients(drink.ingredients);
    setOpen(false);
  }

  function save() {
    setDrinkIngredients(index, ingredients);
    setOpen(false);
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
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Update Ingredients</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            {ingredientItems}
          </Grid>
          <Button 
            variant="contained" 
            onClick={save}
            sx={{maxWidth: '200px'}}
          >
            Save
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

function isPositiveInteger(value) {
  return /^[\d|e]*$/.test(value);
}