from rest_framework import serializers
from .models import Flock, EggLog, MortalityLog, FeedLog, Sale, Expense

class EggLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EggLog
        fields = ['id', 'date', 'count']

class MortalityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MortalityLog
        fields = ['id', 'date', 'count', 'reason']

class FeedLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedLog
        fields = ['id', 'date', 'quantity_kg', 'cost']

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = ['id', 'date', 'item', 'quantity', 'price']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'date', 'item', 'cost']

class FlockSerializer(serializers.ModelSerializer):
    egg_logs = EggLogSerializer(many=True, read_only=True)
    mortality_logs = MortalityLogSerializer(many=True, read_only=True)
    feed_logs = FeedLogSerializer(many=True, read_only=True)
    sales = SaleSerializer(many=True, read_only=True)
    expenses = ExpenseSerializer(many=True, read_only=True)

    class Meta:
        model = Flock
        fields = ['id', 'name', 'breed', 'initial_count', 'acquisition_date', 'egg_logs', 'mortality_logs', 'feed_logs', 'sales', 'expenses'] 