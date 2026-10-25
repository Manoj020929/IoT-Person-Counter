
from datetime import datetime, timedelta
from django.utils import timezone


from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Hall, Event
from .serializers import HallSerializer, EventSerializer


class HallListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        halls = Hall.objects.all()
        return Response(HallSerializer(halls, many=True).data)


class EventListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        events = Event.objects.order_by("-timestamp")[:50]
        return Response(EventSerializer(events, many=True).data)


class SensorEventView(APIView):
    """The ESP32 posts here. Protected by a simple API key."""
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        key = request.headers.get("X-API-KEY")
        if key != settings.SENSOR_API_KEY:
            return Response({"error": "Invalid key"}, status=status.HTTP_403_FORBIDDEN)

        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class HistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hall_id = request.query_params.get("hall")
        date_str = request.query_params.get("date")
        day = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else timezone.localdate()

        start = timezone.make_aware(datetime.combine(day, datetime.min.time()))
        end = start + timedelta(days=1)

        qs = Event.objects.filter(hall_id=hall_id)
        before = qs.filter(timestamp__lt=start)
        inside = max(before.filter(type="IN").count() - before.filter(type="OUT").count(), 0)

        day_events = qs.filter(timestamp__gte=start, timestamp__lt=end)
        result = []
        for h in range(24):
            hs = start + timedelta(hours=h)
            he = hs + timedelta(hours=1)
            chunk = day_events.filter(timestamp__gte=hs, timestamp__lt=he)
            ins = chunk.filter(type="IN").count()
            outs = chunk.filter(type="OUT").count()
            inside = max(inside + ins - outs, 0)
            result.append({"hour": f"{h:02d}:00", "entries": ins, "exits": outs, "inside": inside})
        return Response(result)