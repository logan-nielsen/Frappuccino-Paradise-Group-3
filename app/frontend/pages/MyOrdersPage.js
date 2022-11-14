import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import MyOrderItem from '../components/MyOrderItem';
import { Alert, Snackbar } from '@mui/material';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarError, setSnackbarError] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState();

  useEffect(() => {
    getOrders()
  }, []);

  function getOrders() {
    fetch('api/getmyorders/')
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar(json.error, true);
        }
        else {
          setOrders(json);
        }
      })
    .catch((err) => {
      console.log(err)
      openSnackbar("Failed to retrieve orders", false);
    })
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

  const orderItems = orders.map((order, index) => 
    <MyOrderItem
      key={index} 
      order={order}
    />
  );


  return (
    <>
    <Stack spacing={2}>
      <Typography component="h2" variant="h4">My Orders</Typography>
      {orderItems.length > 0 ?
        orderItems
      :
        <Typography>You haven't placed any orders</Typography>
      }
    </Stack>

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
  )
}