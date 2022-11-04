import { Button } from "@mui/material";
import React from "react";

export default function PayEmployees() {

  function payEmployees() {
    fetch("api/pay/")
      .then(response => response.json())
  }

  return (
    <Button 
      variant="contained" 
      onClick={payEmployees}
      sx={{maxWidth: '200px'}}
    >
      Pay All Employees
    </Button>
  );
}
