from django.db import models

# Create your models here.
class Notes(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.CharField(max_length=2000)
    index = models.BigIntegerField()