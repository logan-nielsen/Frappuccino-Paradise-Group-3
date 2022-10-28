import { Button, Card, CardContent, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useEffect } from 'react'

export default function ManageOrderItem({ order, setReady, setDelivered }) {

  const orderItems = order.order_items.map((order, orderIndex) =>
    <li key={orderIndex}>
      {order.drink_name}: {order.number}

      {/* List Add Ons */}
      <ul>
        {order.addons.map((addOn, addOnIndex) =>
          <li key={addOnIndex}>{addOn.ingredient_name}: {addOn.number}</li>
        )}
      </ul>
    </li>
  )

  return (
    <Card variant="outlined" sx={{ maxWidth: '400px' }}>
      <CardContent>
        <Stack spacing={2}>
          <div>
            <Typography component="h3" variant="h5">{order.customerName}</Typography>
            <Typography>Order placed at {order.formatted_time}</Typography>
            <Typography>Status: { order.isReady ? "ready for pickup" : "in progress" }</Typography>

            <ul>
              { orderItems }
            </ul>
          </div>

          {order.isReady ?
          <Button 
            variant="contained" 
            onClick={() => setDelivered(order.id)}
          >Mark as Delivered</Button>
          :
          <Button 
          variant="contained" 
          onClick={() => setReady(order.id)}
          >Mark as Ready</Button>
          }
        </Stack>
      </CardContent>
    </Card>
  )
}