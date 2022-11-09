import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import MyOrderItem from '../components/MyOrderItem';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getOrders()
  }, []);

  function getOrders() {
  fetch('api/myorders/')
    .then(response => response.json())
    .then(json => {
      setOrders(json);
      console.log(json);
    })
  }

  const orderItems = orders.map((order, index) => 
  <MyOrderItem
    key={index} 
    order={order}
    setReady={setReady}
    setDelivered={setDelivered}
  />
  )

  return (
  <Stack spacing={2}>
    <Typography component="h2" variant="h4">Manage Orders</Typography>
    { orderItems }
  </Stack>
  )
}