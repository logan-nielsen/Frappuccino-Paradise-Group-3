import { Button, Card, CardContent, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useEffect } from 'react'

export default function ManageOrderItem({ order, setReady, setDelivered }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography component="h3" variant="subtitle1">{order.customerName}</Typography>
          <Typography>{order.time}</Typography>
          <Button variant="contained" onClick={setReady}>Set Ready</Button>
          <Button variant="contained" onClick={setDelivered}>Set Delivered</Button>
        </Stack>
      </CardContent>
    </Card>
  )
}