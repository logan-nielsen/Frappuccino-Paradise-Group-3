from django.test import TestCase
from django.contrib.auth import get_user_model
from djmoney.money import Money
from FrappuccinoParadise.models import Drink, Order, Ingredient, OrderItem, Account, TimeCard 


# Create your tests here.
class EditMenuTest(TestCase):

    def setup(self):
        self.user = get_user_model().objects.get(username='manager')
        self.client.force_login(self.user)

    def testAddMenuItem(self):
        request =  {'name': 'Rollaccino',
                    'price': '8',
                    'ingredients': [{"id":1,"name":"Coffee Beans","cost_currency":"USD","cost":"1.00","amountPurchased":86,"number":"1"},
                                    {"id":2,"name":"Milk","cost_currency":"USD","cost":"1.00","amountPurchased":93,"number":"1"},
                                    {"id":3,"name":"Cinnamon","cost_currency":"USD","cost":"0.50","amountPurchased":93,"number":"1"},
                                    {"id":4,"name":"Ice Cream","cost_currency":"USD","cost":"2.00","amountPurchased":93,"number":"1"},
                                    {"id":5,"name":"Egg","cost_currency":"USD","cost":"1.00","amountPurchased":95,"number":"1"},
                                    {"id":6,"name":"Sugar","cost_currency":"USD","cost":"0.25","amountPurchased":98,"number":"1"},
                                    {"id":7,"name":"Creamer","cost_currency":"USD","cost":"0.50","amountPurchased":120,"number":"1"},
                                    {"id":8,"name":"Matcha","cost_currency":"USD","cost":"1.00","amountPurchased":94,"number":"1"},
                                    {"id":9,"name":"Vanilla","cost_currency":"USD","cost":"1.00","amountPurchased":93,"number":"1"},
                                    {"id":10,"name":"Honey","cost_currency":"USD","cost":"1.00","amountPurchased":93,"number":"1"}]}
        response = self.client.post('/app/api/addmenuitem/', request)
        print(response.content)
        print(response.status)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"error": None})
        drink = Drink.objects.get(name='Rollaccino')
        self.assertEqual(drink.name, 'Rollaccino')
        self.assertEqual(drink.cost, Money('10.00', 'USD'))
        ingredientids = []
        for i in drink.ingredientitem_set.all().values():
            ingredientids.append(i['ingredient_id'])
        self.assertContains(ingredientids, text='1', count=1)
        self.assertContains(ingredientids, text='2', count=1)
        self.assertContains(ingredientids, text='3', count=1)
        self.assertContains(ingredientids, text='4', count=1)
        self.assertContains(ingredientids, text='5', count=1)
        self.assertContains(ingredientids, text='6', count=1)
        self.assertContains(ingredientids, text='7', count=1)
        self.assertContains(ingredientids, text='8', count=1)
        self.assertContains(ingredientids, text='9', count=1)
        self.assertContains(ingredientids, text='10', count=1)
