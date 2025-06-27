from django.db import models

class Flock(models.Model):
    name = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)
    initial_count = models.PositiveIntegerField()
    acquisition_date = models.DateField()

    def __str__(self):
        return self.name

class EggLog(models.Model):
    flock = models.ForeignKey(Flock, related_name='egg_logs', on_delete=models.CASCADE)
    date = models.DateField()
    count = models.PositiveIntegerField()

class MortalityLog(models.Model):
    flock = models.ForeignKey(Flock, related_name='mortality_logs', on_delete=models.CASCADE)
    date = models.DateField()
    count = models.PositiveIntegerField()
    reason = models.CharField(max_length=255, blank=True, null=True)

class FeedLog(models.Model):
    flock = models.ForeignKey(Flock, related_name='feed_logs', on_delete=models.CASCADE)
    date = models.DateField()
    quantity_kg = models.FloatField()
    cost = models.FloatField()

class Sale(models.Model):
    ITEM_CHOICES = [
        ('Eggs', 'Eggs'),
        ('Chicken', 'Chicken'),
    ]
    flock = models.ForeignKey(Flock, related_name='sales', on_delete=models.CASCADE)
    date = models.DateField()
    item = models.CharField(max_length=10, choices=ITEM_CHOICES)
    quantity = models.PositiveIntegerField()
    price = models.FloatField()

class Expense(models.Model):
    flock = models.ForeignKey(Flock, related_name='expenses', on_delete=models.CASCADE)
    date = models.DateField()
    item = models.CharField(max_length=100)
    cost = models.FloatField() 