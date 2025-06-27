from rest_framework import viewsets
from .models import Flock, EggLog, MortalityLog, FeedLog, Sale, Expense
from .serializers import FlockSerializer, EggLogSerializer, MortalityLogSerializer, FeedLogSerializer, SaleSerializer, ExpenseSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class FlockViewSet(viewsets.ModelViewSet):
    queryset = Flock.objects.all()
    serializer_class = FlockSerializer

    @action(detail=True, methods=['get', 'post'])
    def egg_logs(self, request, pk=None):
        flock = self.get_object()
        if request.method == 'GET':
            serializer = EggLogSerializer(flock.egg_logs.all(), many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = EggLogSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(flock=flock)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

    @action(detail=True, methods=['get', 'post'])
    def mortality_logs(self, request, pk=None):
        flock = self.get_object()
        if request.method == 'GET':
            serializer = MortalityLogSerializer(flock.mortality_logs.all(), many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = MortalityLogSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(flock=flock)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

    @action(detail=True, methods=['get', 'post'])
    def feed_logs(self, request, pk=None):
        flock = self.get_object()
        if request.method == 'GET':
            serializer = FeedLogSerializer(flock.feed_logs.all(), many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = FeedLogSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(flock=flock)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

    @action(detail=True, methods=['get', 'post'])
    def sales(self, request, pk=None):
        flock = self.get_object()
        if request.method == 'GET':
            serializer = SaleSerializer(flock.sales.all(), many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = SaleSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(flock=flock)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

    @action(detail=True, methods=['get', 'post'])
    def expenses(self, request, pk=None):
        flock = self.get_object()
        if request.method == 'GET':
            serializer = ExpenseSerializer(flock.expenses.all(), many=True)
            return Response(serializer.data)
        elif request.method == 'POST':
            serializer = ExpenseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(flock=flock)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400) 