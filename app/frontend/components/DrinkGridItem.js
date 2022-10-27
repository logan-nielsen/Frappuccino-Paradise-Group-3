import React from 'react';
import { Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';

export default function DrinkGridItem({ drink, setSelectedDrink, setDrinkDialogOpen }) {
  
  function handleClick() {
    setSelectedDrink(drink)
    setDrinkDialogOpen(true)
  }

  return (
    <Grid 
      item
      xs={4}
    >
      <Card variant="outlined" className='drink-card'>
        <CardActionArea 
          onClick={handleClick}
          sx={{ height: '100%' }}
        >
          <CardContent>
            <Typography>{ drink ? drink.name : "" }</Typography>
            <p>${ drink ? drink.cost : "" }</p>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}