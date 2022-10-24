import React from 'react';
import { Card, CardActionArea, CardContent, Grid } from '@mui/material';

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
      <Card className='drink-card'>
        <CardActionArea 
          onClick={handleClick}
          sx={{ height: '100%' }}
        >
          <CardContent>
            { drink }
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}