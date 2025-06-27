from django.contrib import admin
from .models import Flock, EggLog, MortalityLog, FeedLog, Sale, Expense

admin.site.register(Flock)
admin.site.register(EggLog)
admin.site.register(MortalityLog)
admin.site.register(FeedLog)
admin.site.register(Sale)
admin.site.register(Expense) 