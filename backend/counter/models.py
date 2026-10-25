from django.db import models


class Hall(models.Model):
    name = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField(default=100)

    def __str__(self):
        return self.name


class Event(models.Model):
    IN = "IN"
    OUT = "OUT"
    TYPE_CHOICES = [(IN, "Entry"), (OUT, "Exit")]

    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, related_name="events")
    type = models.CharField(max_length=3, choices=TYPE_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.hall.name} - {self.type} at {self.timestamp}"