import json

from channels.generic.websocket import AsyncWebsocketConsumer


class PresenterConsumer(
    AsyncWebsocketConsumer
):
    async def connect(self):
        self.session_key = (
            self.scope["url_route"]
            ["kwargs"]["session_key"]
        )

        self.room_group_name = (
            f"presenter_{self.session_key}"
        )

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(
        self,
        close_code
    ):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(
        self,
        text_data
    ):
        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "presenter_message",
                "payload": data,
            }
        )


    async def presenter_message(
        self,
        event
    ):
        await self.send(
            text_data=json.dumps(
                event["payload"]
            )
        )