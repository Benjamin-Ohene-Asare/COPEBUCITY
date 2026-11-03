from django.urls import re_path

from .consumers import PresenterConsumer


websocket_urlpatterns = [
    re_path(
        r"ws/presenter/(?P<session_key>[0-9a-f-]+)/$",
        PresenterConsumer.as_asgi()
    ),
]