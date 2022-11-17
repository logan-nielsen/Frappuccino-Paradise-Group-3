from datetime import datetime
from django.test import TestCase
from django.contrib.auth import get_user_model
from djmoney.money import Money


# Create your tests here.
class PayrollTest(TestCase):
    def setUp(self):
        user = get_user_model().objects.get(username='barista1')
        user.account.timecard_set.create(date = datetime.now().date(), hours = 4)

    def testAddShift(self):
        user = get_user_model().objects.get(username='barista1')
        self.client.force_login(user)

        response = self.client.post('/app/api/loghours/', {
            'hours': 4
        })
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, {'error': None})

    
    def testUnauthorizedAddShift(self):
        user = get_user_model().objects.get(username='customer1')
        self.client.force_login(user)

        response = self.client.post('/app/api/loghours/', {
            'hours': 4
        })
        self.assertEqual(response.status_code, 302)


    def testPayBaristas(self):
        manager = get_user_model().objects.get(username='manager')
        self.client.force_login(manager)
        manager.account.credit = Money(100, 'USD')
        manager.account.save()

        barista = get_user_model().objects.get(username='barista1')
        self.assertEqual(barista.account.credit.amount, 0)

        response = self.client.post('/app/api/pay/')
        self.assertEqual(response.status_code, 200)

        barista = get_user_model().objects.get(username='barista1')
        self.assertEqual(barista.account.credit.amount, 60)


    def testInsufficientFundsPay(self):
        manager = get_user_model().objects.get(username='manager')
        self.client.force_login(manager)

        response = self.client.post('/app/api/pay/')
        self.assertEqual(response.status_code, 400)
        