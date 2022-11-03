import { Button, Divider } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'React';
import BuyInventory from '../components/BuyInventory';
import ManageMenu from '../components/ManageMenu';

export default function ManagerDashboardPage() {

  function payEmployees() {
    fetch("api/pay/")
      .then(response => response.json())
  }

  return (
    <Stack spacing={2}>
      <Button 
        variant="contained" 
        onClick={payEmployees}
        sx={{maxWidth: '200px'}}
      >
        Pay All Employees
      </Button>
      <Divider />
      <ManageMenu />
      <BuyInventory />
    </Stack>
  );
}