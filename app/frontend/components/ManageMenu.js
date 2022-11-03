import { Button, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function ManageMenu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetch('api/getmenu')
    .then(response => response.json())
    .then(json => {
      setMenu(json);
    })
  }, [])

  useEffect(() => {
    console.log(menu)
  }, [menu])

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
    else if (isValidMoney(value)) {
      if (value.length > 1 && value.startsWith('0')) {
        value = value.slice(1);
      }
      
      setMenuPrice(index, value);
    }
  }

  function saveMenu() {
    console.log("save menu");
  }
  
  const menuItems = menu.map((drink, index) => 
    <TableRow key={index}>
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
        >
          Update Ingredients
        </Button>
      </TableCell> 
    </TableRow>
  );

  return (
    <>
    <Typography variant="h4" gutterBottom>Manage Menu</Typography>
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
    </>
  );
}

function isValidMoneyInput(value) {
  return /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{0,2})?$/.test(value);
}

function isValidMoneyFinal(value) {
  return /^(0|[1-9][0-9]{0,2})(,\d{3})*(\.\d{1,2})?$/.test(value);
}