import { Alert, Box, Button, Divider, Snackbar, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddBarista from '../components/AddBarista';
import BuyInventory from '../components/BuyInventory';
import ManageMenu from '../components/ManageMenu';
import PayEmployees from '../components/PayEmployees';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ManagerDashboardPage() {
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState();

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  function openSnackbar(message, error=false) {
    setSnackbarError(error);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
    setSnackbarMessage(undefined);
  }

  return (
    <>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Pay Employees" value={0} />
          <Tab label="Manage Menu" value={1} />
          <Tab label="Buy Inventory" value={2} />
          <Tab label="Add Barista" value={3} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <PayEmployees openSnackbar={openSnackbar} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ManageMenu openSnackbar={openSnackbar} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <BuyInventory openSnackbar={openSnackbar} />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <AddBarista openSnackbar={openSnackbar} />
      </TabPanel>
    </Box>
    
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
    >
      <Alert 
        onClose={handleSnackbarClose}
        severity={ snackbarError ? 'error' : 'success' }
      >
        { snackbarMessage }
      </Alert>
    </Snackbar>
    </>
  );
}