from django.test import TestCase
from django.contrib.auth import get_user_model
from djmoney.money import Money
from FrappuccinoParadise.models import Drink, Order, Ingredient, OrderItem, Account, TimeCard 


# Create your tests here.
class EditMenuTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.get(username='manager')
        self.client.force_login(self.user)

    def testAddMenuItem(self):
        request =  {'name': 'Rollaccino',
                    'price': '10',
                    'ingredients': '''[{"id":1,"name":"Coffee Beans","cost_currency":"USD","cost":"1.00","amountPurchased":86,"number":"1"},
                                    {"id":2,"name":"Milk","cost_currency":"USD","cost":"1.00","amountPurchased":93,"number":"1"},
                                    {"id":3,"name":"Cinnamon","cost_currency":"USD","cost":"0.50","amountPurchased":93,"number":"1"},
                                    {"id":4,"name":"Ice Cream","cost_currency":"USD","cost":"2.00","amountPurchased":93,"number":"1"},
                                    {"id":5,"name":"Egg","cost_currency":"USD","cost":"1.00","amountPurchased":95,"number":"1"},
                                    {"id":6,"name":"Sugar","cost_currency":"USD","cost":"0.25","amountPurchased":98,"number":"1"},
                                    {"id":7,"name":"Creamer","cost_currency":"USD","cost":"0.50","amountPurchased":120,"number":"1"},
                                    {"id":8,"name":"Matcha","cost_currency":"USD","cost":"1.00","amountPurchased":94,"number":"1"},
                                    {"id":9,"name":"Vanilla","cost_currency":"USD","cost":"1.00","amountPurchased":93,"number":"1"},
                                    {"id":10,"name":"Honey","cost_currency":"USD","cost":"1.00","amountPurchased":93,"number":"1"}]'''}
        response = self.client.post('/app/api/addmenuitem/', request)    
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"error": None})
        drink = Drink.objects.get(name='Rollaccino')
        self.assertEqual(drink.name, 'Rollaccino')
        self.assertEqual(drink.cost, Money('10.00', 'USD'))
        ingredientids = []
        for i in drink.ingredientitem_set.all().values():
            ingredientids.append(i['ingredient_id'])
            self.assertTrue(i['number'] == 1)
        self.assertTrue(1 in ingredientids)
        self.assertTrue(2 in ingredientids)
        self.assertTrue(3 in ingredientids)
        self.assertTrue(4 in ingredientids)
        self.assertTrue(5 in ingredientids)
        self.assertTrue(6 in ingredientids)
        self.assertTrue(7 in ingredientids)
        self.assertTrue(8 in ingredientids)
        self.assertTrue(9 in ingredientids)
        self.assertTrue(10 in ingredientids)
