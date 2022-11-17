from django.test import TestCase
from django.contrib.auth import get_user_model
from djmoney.money import Money


# Create your tests here.
class BuyInventoryTest(TestCase):
    def testBuyInventory(self):
        user = get_user_model().objects.get(username='manager')
        self.client.force_login(user)
        user.account.credit = Money(100, 'USD')
        user.account.save()

        self.assertEqual(user.account.credit.amount, 100)

        response = self.client.post('/app/api/buyingredients/', {
            "cost": 1.75,
            "ingredients": '''[
                {
                    "id": 3,
                    "number": 2
                },
                {
                    "id": 6,
                    "number": 3
                }
            ]'''
        })
        self.assertEqual(response.status_code, 200)

        user = get_user_model().objects.get(username='manager')
        self.assertEqual(user.account.credit.amount, 98.25)


    def testUnauthorizedBuyInventory(self):
        user = get_user_model().objects.get(username='customer1')
        self.client.force_login(user)

        response = self.client.post('/app/api/buyingredients/', {
            "cost": 1.75,
            "ingredients": '''[
                {
                    "id": 3,
                    "number": 2
                },
                {
                    "id": 6,
                    "number": 3
                }
            ]'''
        })
        self.assertEqual(response.status_code, 302)
        
        user = get_user_model().objects.get(username='barista1')
        self.client.force_login(user)

        response = self.client.post('/app/api/buyingredients/', {
            "cost": 1.75,
            "ingredients": '''[
                {
                    "id": 3,
                    "number": 2
                },
                {
                    "id": 6,
                    "number": 3
                }
            ]'''
        })
        self.assertEqual(response.status_code, 302)