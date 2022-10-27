import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import ManageOrderItem from '../components/ManageOrderItem';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch('api/getorders/')
      .then(response => response.json())
      .then(json => {
        setOrders(json);
        console.log(json);
      })
  }, []);

  function setReady() {
    console.log("set ready")
  }

  function setDelivered() {
    console.log("set delivered")
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