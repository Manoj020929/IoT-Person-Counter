from rest_framework import serializers
from .models import Hall, Event


class HallSerializer(serializers.ModelSerializer):
    current_count = serializers.SerializerMethodField()

    class Meta:
        model = Hall
        fields = ["id", "name", "capacity", "current_count"]

    def get_current_count(self, obj):
        ins = obj.events.filter(type="IN").count()
        outs = obj.events.filter(type="OUT").count()
        return max(ins - outs, 0)


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "hall", "type", "timestamp"]
        read_only_fields = ["timestamp"]