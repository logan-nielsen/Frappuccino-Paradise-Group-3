import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function SelectDrink({ drink, setDrink }) {
  
  function handleChange(event) {
    setDrink(event.target.value)
  }

  return (
    <FormControl>
      <FormLabel>Drinks</FormLabel>
      <RadioGroup
        name="drinks"
        aria-labelledby="demo-radio-buttons-group-label"
        value={drink}
        onChange={handleChange}
      >
        <FormControlLabel 
          value="drink1" 
          control={<Radio />} 
          label="Drink 1" 
        />
        <FormControlLabel 
          value="drink2" 
          control={<Radio />} 
          label="Drink 2" 
        />
        <FormControlLabel 
          value="drink3" 
          control={<Radio />} 
          label="Drink 3" 
        />
      </RadioGroup>
    </FormControl>
  );
}