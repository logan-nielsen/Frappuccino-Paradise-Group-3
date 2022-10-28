import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import ManageOrderItem from '../components/ManageOrderItem';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getOrders()
  }, []);

  function getOrders() {
    fetch('api/getorders/')
      .then(response => response.json())
      .then(json => {
        setOrders(json);
        console.log(json);
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
        if (!json.error) {
          getOrders()
        }
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
        if (!json.error) {
          getOrders()
        }
      })
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
    <Stack spacing={2}>
      <Typography component="h2" variant="h4">Manage Orders</Typography>
      { manageOrderItems }
    </Stack>
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