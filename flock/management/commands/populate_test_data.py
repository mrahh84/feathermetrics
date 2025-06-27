from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from flock.models import Flock, EggLog, MortalityLog, FeedLog, Sale, Expense
import random

class Command(BaseCommand):
    help = 'Populate the database with test data for 6 months'

    def handle(self, *args, **kwargs):
        # Clear existing data
        EggLog.objects.all().delete()
        MortalityLog.objects.all().delete()
        FeedLog.objects.all().delete()
        Sale.objects.all().delete()
        Expense.objects.all().delete()
        Flock.objects.all().delete()

        today = timezone.now().date()
        acquisition_date = today - timedelta(days=180)
        flock = Flock.objects.create(
            name='Sunrise Layers',
            breed='ISA Brown',
            initial_count=50,
            acquisition_date=acquisition_date
        )

        # Egg logs: 180 days
        for i in range(180):
            date = acquisition_date + timedelta(days=i)
            count = 40 + random.randint(-2, 6) - int(i / 60)  # slight decline over time
            EggLog.objects.create(flock=flock, date=date, count=count)

        # Mortality logs: 2 events
        MortalityLog.objects.create(flock=flock, date=acquisition_date + timedelta(days=85), count=1, reason='Unknown')
        MortalityLog.objects.create(flock=flock, date=acquisition_date + timedelta(days=160), count=1, reason='Predator')

        # Feed logs: every 7 days
        for i in range(0, 180, 7):
            date = acquisition_date + timedelta(days=i)
            quantity_kg = 20 + random.uniform(0, 2)
            cost = 15 + random.uniform(0, 2)
            FeedLog.objects.create(flock=flock, date=date, quantity_kg=quantity_kg, cost=cost)

        # Sales: every week, mostly eggs, one chicken sale
        for i in range(0, 180, 7):
            date = acquisition_date + timedelta(days=i)
            if i == 140:
                Sale.objects.create(flock=flock, date=date, item='Chicken', quantity=5, price=5*12)
            else:
                quantity = 20 + random.randint(0, 5)
                price = quantity * 3.5
                Sale.objects.create(flock=flock, date=date, item='Eggs', quantity=quantity, price=price)

        # Expenses: every month
        for i in range(0, 180, 30):
            date = acquisition_date + timedelta(days=i)
            if i % 60 == 0:
                Expense.objects.create(flock=flock, date=date, item='Feed Purchase', cost=120 + random.uniform(0, 20))
            else:
                Expense.objects.create(flock=flock, date=date, item='Medication/Supplements', cost=45 + random.uniform(0, 10))

        self.stdout.write(self.style.SUCCESS('Test data populated successfully.')) 