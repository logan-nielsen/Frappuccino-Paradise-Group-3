import { Button } from '@mui/material';
import React from 'React';

export default function ManagerDashboardPage() {

  function payEmployees() {
    fetch("api/pay/")
      .then(response => response.json())
  }

  return (
    <Button 
      variant="contained" 
      onClick={payEmployees}
    >
      Pay All Employees
    </Button>
  );
}