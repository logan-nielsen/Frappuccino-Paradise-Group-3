import { Checkbox, FormControlLabel, FormGroup, FormLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';

export default function SelectAddOns({ addOns, setAddOns }) {
  
  function addAddOn(addOn) {
    setAddOns([...addOns, addOn])
  }

  function removeAddOn(addOn) {
    setAddOns([...(addOns.filter(item => item != addOn))])
  }

  function handleChange(event) {
    if (event.target.checked) {
      addAddOn(event.target.value)
    }
    else {
      removeAddOn(event.target.value)
    }
  }

  return (
    <>
    <FormGroup>
      <FormLabel>Add Ons</FormLabel>
      <FormControlLabel
        checked={addOns.includes("addOn1")}
        onChange={handleChange} 
        value="addOn1" 
        control={<Checkbox />} 
        label="Add on 1" 
      />
      <FormControlLabel
        checked={addOns.includes("addOn2")}
        onChange={handleChange} 
        value="addOn2" 
        control={<Checkbox />} 
        label="Add on 2" 
      />
      <FormControlLabel
        checked={addOns.includes("addOn3")}
        onChange={handleChange} 
        value="addOn3" 
        control={<Checkbox />} 
        label="Add on 3" 
      />
    </FormGroup>
    </>
  );
}