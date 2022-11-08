import { Button, IconButton, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import AddDrinkDialog from './AddDrinkDialog';
import MenuIngredientsDialog from './MenuIngredientsDialog';
import DeleteDrinkDialog from './DeleteDrinkDialog';

export default function ManageMenu({ openSnackbar }) {
  const [menu, setMenu] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [addDrinkDialogOpen, setAddDrinkDialogOpen] = useState(false);

  useEffect(() => {
    getMenu();
  }, [])

  async function getMenu() {
    const [ingredients, newMenu] = await Promise.all([
      fetch('api/getingredients/').then(response => response.json()),
      fetch('api/getmenu/').then(response => response.json())
    ])

    ingredients.forEach(ingredient => {
      ingredient.number = 0;
    });
    setIngredientsList(ingredients);

    let promises = [];
    for (const i in newMenu) {
      promises[i] = await getRecipe(newMenu[i], ingredients);
    }

    let recipes;
    [...recipes] = await Promise.all(promises);
    for (const i in recipes) {
      newMenu[i].ingredients = recipes[i];
    }

    setMenu(newMenu);
  }

  async function getRecipe(drink, initialRecipe) {
    let recipe = await fetch(`api/getrecipe/?id=${drink.id}`)
      .then(response => response.json())
    
    let drinkIngredients = structuredClone(initialRecipe);
    recipe.forEach((element) => {
      drinkIngredients.forEach(ingredient => {
        if (element.ingredient_id == ingredient.id) {
          ingredient.number = element.number;
        }
      })
    })

    return drinkIngredients;
  }

  function setIngredients(index, newIngredients) {
    let newMenu = [...menu];
    let drink = {...menu[index]};
    drink.ingredients = newIngredients;
    newMenu[index] = drink;
    setMenu(newMenu);
  }

  function setMenuName(index, name) {
    let newMenu = [...menu];
    let drink = {...menu[index]};
    drink.name = name;
    newMenu[index] = drink
    setMenu(newMenu);
  }
  
  function setMenuPrice(index, price) {
    let newMenu = [...menu];
    let drink = {...menu[index]};
    drink.cost = price;
    newMenu[index] = drink
    setMenu(newMenu);
  }

  function handleNameInput(event, index) {
    let value = event.target.value;
    
    if (!value) {
      setMenuName(index, "");
    }
    else {
      setMenuName(index, value);
    }
  }

  function handlePriceInput(event, index) {
    let value = event.target.value;
    
    if (!value) {
      setMenuPrice(index, "");
    }
    else if (isValidMoneyInput(value)) {
      if (value.length > 1 && value.startsWith('0')) {
        value = value.slice(1);
      }
      
      setMenuPrice(index, value);
    }
  }

  function saveMenu() {
    for (const drink of menu) {
      if (!isValidMoneyFinal(drink.cost)) {
        openSnackbar(`Invalid price for drink ${drink.name}`, true);
        return;
      }
    }

    let formData = new FormData();
    formData.append(
      'csrfmiddlewaretoken',
      getCookie('csrftoken')
    )
    formData.append(
      'menu',
      JSON.stringify(menu)
    )

    fetch('api/editmenu/', {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar('Failed to save menu', true);
        }
        else {
          openSnackbar('Successfully saved menu');
          getMenu();
        }
      })
  }

      
  const menuItems = menu.map((drink, index) => 
    <MenuItem 
      key={index} 
      index={index}
      drink={drink} 
      setDrinkIngredients={setIngredients} 
      handleNameInput={handleNameInput}
      handlePriceInput={handlePriceInput}
      openSnackbar={openSnackbar}
      getMenu={getMenu}
    />
  );

  return (
    <>
    <Typography variant="h4" gutterBottom>Manage Menu</Typography>
    <Stack spacing={2}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Ingredients</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems}
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <Button 
          variant="contained" 
          onClick={saveMenu}
          sx={{maxWidth: '200px', marginRight: '20px'}}
        >
          Save Menu
        </Button>
        <Button 
          variant="contained" 
          onClick={() => setAddDrinkDialogOpen(true)}
          sx={{maxWidth: '200px'}}
        >
          Create Drink
        </Button>
      </div>
    </Stack>

    <AddDrinkDialog
      open={addDrinkDialogOpen}
      setOpen={setAddDrinkDialogOpen}
      ingredientsList={ingredientsList}
      getMenu={getMenu}
      openSnackbar={openSnackbar}
    />
    </>
  );
}

function MenuItem({
  index, 
  drink, 
  handleNameInput, 
  handlePriceInput,
  setDrinkIngredients,
  openSnackbar,
  getMenu
}) {
  const [ingredientsDialogOpen, setIngredientsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
    <TableRow>
      <TableCell>
        <TextField
          value={drink.name}
          required
          error={drink.name === ""}
          onChange={event => handleNameInput(event, index)}
          sx={{ marginTop: "10px" }}
        />
      </TableCell> 
      <TableCell>
        <TextField
          value={drink.cost}
          required
          error={drink.cost === ""}
          onChange={event => handlePriceInput(event, index)}
          sx={{ marginTop: "10px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">$</InputAdornment>
            ),
          }}
        />
      </TableCell> 
      <TableCell>
        <Button 
          variant="contained" 
          sx={{maxWidth: '200px'}}
          onClick={() => setIngredientsDialogOpen(true)}
        >
          Update Ingredients
        </Button>
      </TableCell> 
      <TableCell>
        <IconButton 
          color="error"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell> 
    </TableRow>

    <MenuIngredientsDialog
      index={index}
      open={ingredientsDialogOpen}
      setOpen={setIngredientsDialogOpen}
      drink={drink}
      setDrinkIngredients={setDrinkIngredients}
    />
    <DeleteDrinkDialog 
      open={deleteDialogOpen}
      setOpen={setDeleteDialogOpen}
      drink={drink}
      openSnackbar={openSnackbar}
      getMenu={getMenu}
    />
    </>
  )
}

function isValidMoneyInput(value) {
  return /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{0,2})?$/.test(value);
}

function isValidMoneyFinal(value) {
  return /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/.test(value);
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