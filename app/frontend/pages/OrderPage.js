import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import SelectAddOns from '../components/SelectAddOns';
import ConfirmOrder from '../components/ConfirmOrder';
import SelectDrink from '../components/SelectDrink';

const steps = ['Select Drink', 'Add Ons', 'Confirm Order'];
const theme = createTheme();

export default function OrderPage() {
  const [activeStep, setActiveStep] = useState(0);

  function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }
  
  function handleBack() {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  function placeOrder() {
    console.log("order placed");
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
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
            <SelectDrink />
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
            <SelectAddOns />
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
  
              <Button onClick={handleNext}>Next'</Button>
            </Box>
            </>
          )}
          {(activeStep == 2 &&
            <>
            <ConfirmOrder />
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={placeOrder}>Place Order</Button>
            </Box>
            </>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}