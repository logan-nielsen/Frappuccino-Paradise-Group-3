import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import ManageOrderItem from '../components/ManageOrderItem';
import { Alert, Snackbar } from '@mui/material';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState();
  const [snackbarError, setSnackbarError] = useState(false);

  useEffect(() => {
    getOrders()
  }, []);

  function getOrders() {
    fetch('api/getorders/')
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
        openSnackbar("Failed to retrieve orders", true);
      })
  }

  function setReady(orderId) {
    const formData = new FormData()
    formData.append(
      'csrfmiddlewaretoken',
      getCookie('csrftoken')
    )
    formData.append(
      'order_id',
      orderId
    )

    fetch('api/setorderready/', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar(json.error, true);
        }
        else {
          getOrders();
          openSnackbar("Successfully updated order");
        }
      })
      .catch((err) => {
        console.log(err)
        openSnackbar("Failed to mark order as ready", true);
      })
  }

  function setDelivered(orderId) {
    const formData = new FormData()
    formData.append(
      'csrfmiddlewaretoken',
      getCookie('csrftoken')
    )
    formData.append(
      'order_id',
      orderId
    )

    fetch('api/setorderdelivered/', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar(json.error, true);
        }
        else {
          getOrders();
          openSnackbar("Successfully updated order");
        }
      })
      .catch((err) => {
        console.log(err)
        openSnackbar("Failed to mark order as delivered", true);
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

  const manageOrderItems = orders.map((order, index) => 
    <ManageOrderItem
      key={index} 
      order={order}
      setReady={setReady}
      setDelivered={setDelivered}
    />
  )

  return (
    <>
    <Stack spacing={2}>
      <Typography component="h2" variant="h4">Manage Orders</Typography>
      {manageOrderItems.length > 0 ?
        manageOrderItems
      :
        <Typography>There are no pending orders</Typography>
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

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}