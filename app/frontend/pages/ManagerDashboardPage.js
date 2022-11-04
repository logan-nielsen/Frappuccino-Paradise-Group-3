import { Box, Button, Divider, Tab, Tabs, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
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

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Pay Employees" value={0} />
          <Tab label="Manage Menu" value={1} />
          <Tab label="Buy Inventory" value={2} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <PayEmployees />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ManageMenu />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <BuyInventory />
      </TabPanel>
    </Box>
  );
}