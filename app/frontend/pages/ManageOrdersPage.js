import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([])

  return (
    <Stack spacing={2}>
      <Typography component="h2" variant="h4">Manage Orders</Typography>

    </Stack>
  )
}