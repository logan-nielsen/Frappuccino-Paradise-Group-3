import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import SelectDrink from '../components/SelectDrink';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import SelectAddOns from '../components/SelectAddOns';

const steps = ['Select Drink', 'Add Ons'];

export default function DrinkDialog({ addDrink, open, setOpen }) {
  const [activeStep, setActiveStep] = useState(0);
  const [drink, setDrink] = useState(null)
  const [addOns, setAddOns] = useState([])

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }
  
  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function save() {
    addDrink({
      drink: drink,
      addOns: addOns,
    })

    setActiveStep(0);
    setDrink(null)
    setAddOns([])
    setOpen(false);
  }

  function handleClose() {
    
  }

  return (
    <>
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Add Drink</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {/* Conditionally render based on which step the user is on */}
          {activeStep === 0 && (
            <>
            <SelectDrink drink={drink} setDrink={setDrink} />
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />

              <Button onClick={handleNext}>Next</Button>
            </Box>
            </>
          )}
          {activeStep === 1 && (
            <>
            <SelectAddOns addOns={addOns} setAddOns={setAddOns} />
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />

              <Button onClick={save}>Add Drink</Button>
            </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
    </>
  );
}