from django.test import TestCase
from django.contrib.auth import get_user_model
from djmoney.money import Money
from FrappuccinoParadise.models import Ingredient


# Create your tests here.
class PlaceOrderTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.get(username='customer1')
        self.client.force_login(self.user)
        self.user.account.credit += Money(1000, 'USD')
        self.user.account.save()


    def testInsufficientCredit(self):
        self.user.account.credit = Money(0, 'USD')
        self.user.account.save()

        response = self.client.post('/app/api/placeorder/', {
            'order': '''[
                    {
                        "drink":
                        {
                            "id":1,
                            "name":"Black Coffee",
                            "cost_currency":"USD",
                            "cost":"2.00"
                        },
                        "addOns":[],
                        "amount":1,"cost":2
                    }
                ]'''
        })
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"error": 'Insufficient credit'})
    

    def testInsufficientInventory(self):
        response = self.client.post('/app/api/placeorder/', {
            'order': '''[
                    {
                        "drink":
                        {
                            "id":1,
                            "name":"Black Coffee",
                            "cost_currency":"USD",
                            "cost":"2.00"
                        },
                        "addOns":[],
                        "amount":1,"cost":2
                    }
                ]'''
        })
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"error": 'Insufficient inventory'})
    
    
    def testSimpleOrder(self):
        coffeeBeans = Ingredient.objects.get(name='Coffee Beans')
        coffeeBeans.amountPurchased = 20
        coffeeBeans.save()

        response = self.client.post('/app/api/placeorder/', {
            'order': '''[
                    {
                        "drink":{"id":1,"name":"Black Coffee","cost_currency":"USD","cost":"2.00"},
                        "addOns":[],
                        "amount":1,
                        "cost":2
                    }
                ]'''
        })
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"error": None})
    

    def testDrinkAmount(self):
        coffeeBeans = Ingredient.objects.get(name='Coffee Beans')
        coffeeBeans.amountPurchased = 20
        coffeeBeans.save()

        response = self.client.post('/app/api/placeorder/', {
            'order': '''[
                    {
                        "drink":{"id":1,"name":"Black Coffee","cost_currency":"USD","cost":"2.00"},
                        "addOns":[],
                        "amount":3,
                        "cost":6
                    }
                ]'''
        })
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"error": None})
    
    
    def testAddOns(self):
        coffeeBeans = Ingredient.objects.get(name='Coffee Beans')
        coffeeBeans.amountPurchased = 20
        coffeeBeans.save()
        
        creamer = Ingredient.objects.get(name='Creamer')
        creamer.amountPurchased = 20
        creamer.save()

        response = self.client.post('/app/api/placeorder/', {
            'order': '''[
                    {
                        "drink":{"id":1,"name":"Black Coffee","cost_currency":"USD","cost":"2.00"},
                        "addOns":[{"id":7,"name":"Creamer","cost_currency":"USD","cost":"0.50","amountPurchased":3,"number":"1"}],
                        "amount":1,
                        "cost":2.5
                    }
                ]'''
        })
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"error": None})
    

    def testComplexOrder(self):
        ingredients = Ingredient.objects.all()
        for ingredient in ingredients:
            ingredient.amountPurchased = 50
            ingredient.save()

        response = self.client.post('/app/api/placeorder/', {
            'order': '''[{"drink":{"id":1,"name":"Black Coffee","cost_currency":"USD","cost":"2.00"},"addOns":[{"id":5,"name":"Egg","cost_currency":"USD","cost":"1.00","amountPurchased":12,"number":"1"},{"id":7,"name":"Creamer","cost_currency":"USD","cost":"0.50","amountPurchased":35,"number":"2"},{"id":10,"name":"Honey","cost_currency":"USD","cost":"1.00","amountPurchased":18,"number":"1"}],"amount":"3","cost":15},{"drink":{"id":6,"name":"Sugar and Honey","cost_currency":"USD","cost":"3.00"},"addOns":[{"id":2,"name":"Milk","cost_currency":"USD","cost":"1.00","amountPurchased":7,"number":"1"},{"id":4,"name":"Ice Cream","cost_currency":"USD","cost":"2.00","amountPurchased":13,"number":"1"},{"id":6,"name":"Sugar","cost_currency":"USD","cost":"0.25","amountPurchased":25,"number":"4"},{"id":9,"name":"Vanilla","cost_currency":"USD","cost":"1.00","amountPurchased":39,"number":"1"}],"amount":"4","cost":32},{"drink":{"id":5,"name":"Matcha Coffee","cost_currency":"USD","cost":"4.00"},"addOns":[{"id":1,"name":"Coffee Beans","cost_currency":"USD","cost":"1.00","amountPurchased":92,"number":"1"},{"id":2,"name":"Milk","cost_currency":"USD","cost":"1.00","amountPurchased":7,"number":"1"},{"id":3,"name":"Cinnamon","cost_currency":"USD","cost":"0.50","amountPurchased":24,"number":"1"},{"id":4,"name":"Ice Cream","cost_currency":"USD","cost":"2.00","amountPurchased":13,"number":"1"},{"id":5,"name":"Egg","cost_currency":"USD","cost":"1.00","amountPurchased":12,"number":"1"},{"id":6,"name":"Sugar","cost_currency":"USD","cost":"0.25","amountPurchased":25,"number":"1"},{"id":7,"name":"Creamer","cost_currency":"USD","cost":"0.50","amountPurchased":35,"number":"1"},{"id":8,"name":"Matcha","cost_currency":"USD","cost":"1.00","amountPurchased":509,"number":"1"},{"id":9,"name":"Vanilla","cost_currency":"USD","cost":"1.00","amountPurchased":39,"number":"1"},{"id":10,"name":"Honey","cost_currency":"USD","cost":"1.00","amountPurchased":18,"number":"1"}],"amount":"1","cost":13.25}]'''
        })
        self.assertJSONEqual(str(response.content, encoding='utf8'), {"error": None})
