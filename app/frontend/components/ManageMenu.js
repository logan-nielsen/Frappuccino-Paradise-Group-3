import { Button, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useEffect, useState } from 'react';
import MenuIngredientsDialog from './MenuIngredientsDialog';

export default function ManageMenu() {
  const [menu, setMenu] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);

  useEffect(() => {
    fetch('api/getmenu')
      .then(response => response.json())
      .then(json => {
        setMenu(json);
      })

    fetch('api/getingredients')
      .then(response => response.json())
      .then(ingredients => {
        ingredients.forEach(element => {
          element.number = 0;
        });

        setIngredientsList(ingredients);
      })
  }, [])

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

  }

      
  const menuItems = menu.map((drink, index) => 
    <MenuItem 
      key={index} 
      index={index}
      drink={drink} 
      ingredientsList={ingredientsList} 
      handleNameInput={handleNameInput}
      handlePriceInput={handlePriceInput}
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
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems}
          </TableBody>
        </Table>
      </TableContainer>
      <Button 
        variant="contained" 
        onClick={saveMenu}
        sx={{maxWidth: '200px'}}
      >
        Save Menu
      </Button>
    </Stack>
    </>
  );
}

function MenuItem({index, drink, ingredientsList, handleNameInput, handlePriceInput}) {
  const [ingredientsDialogOpen, setIngredientsDialogOpen] = useState(false);

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
    </TableRow>

    <MenuIngredientsDialog
      open={ingredientsDialogOpen}
      setOpen={setIngredientsDialogOpen}
      drink={drink}
      ingredientsList={ingredientsList}
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