from django.test import TestCase
from django.contrib.auth import get_user_model
from djmoney.money import Money
from FrappuccinoParadise.models import Drink, Order, Ingredient, OrderItem
import json


# Create your tests here.
class ManageOrdersTest(TestCase):
    def setUp(self):
        # Setup example order
        user = get_user_model().objects.get(username='customer1')
        user.account.credit += Money(1000, 'USD')
        user.account.save()

        ingredients = Ingredient.objects.all()
        for ingredient in ingredients:
            ingredient.amountPurchased = 50
            ingredient.save()

        order = Order(customer=user, cost=17.5)
        order.save()

        self.orderId = order.id
        
        orderItem = OrderItem(
            order = order,
            drink = Drink.objects.get(name="Coffee Float"),
            number = 1
        )
        orderItem.save()


    def testViewMyOrders(self):
        user = get_user_model().objects.get(username='customer1')
        self.client.force_login(user)

        response = self.client.get('/app/api/getmyorders/')
        order = json.loads(response.content)[0]

        self.assertEqual(order['customer_id'], 4)
        self.assertFalse(order['isReady'])
        self.assertFalse(order['isDelivered'])


    def testOrderProcess(self):
        user = get_user_model().objects.get(username='barista1')
        self.client.force_login(user)

        order = Order.objects.get(pk=self.orderId)

        self.assertEqual(order.customer.id, 4)
        self.assertFalse(order.isReady)
        self.assertFalse(order.isDelivered)

        response = self.client.post('/app/api/setorderready/', {
            'order_id': self.orderId
        })
        order = Order.objects.get(pk=self.orderId)

        self.assertJSONEqual(response.content, {'error': None})
        self.assertTrue(order.isReady)
        self.assertFalse(order.isDelivered)

        response = self.client.post('/app/api/setorderdelivered/', {
            'order_id': self.orderId
        })
        order = Order.objects.get(pk=self.orderId)

        self.assertTrue(order.isReady)
        self.assertTrue(order.isDelivered)

    
    def testUnauthorizedManageOrder(self):
        user = get_user_model().objects.get(username='customer1')
        self.client.force_login(user)
        
        response = self.client.post('/app/api/setorderready/', {
            'order_id': self.orderId
        })
        self.assertEqual(response.status_code, 302)