import redis.asyncio as redis
from app.core.config import settings

class RedisManager:
    def __init__(self):
        self.redis_client: redis.Redis | None = None

    async def connect(self):
        try:
            self.redis_client = redis.from_url(
                f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}",
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=1 # Fast fail for demo
            )
            await self.redis_client.ping()
            print("Redis Connected!")
        except Exception as e:
            print(f"Redis Connection Failed: {e}. Switching to Mock Mode.")
            self.redis_client = None

    async def get_client(self):
        if not self.redis_client:
            # Return a simple mock object if redis failed
            class MockRedis:
                async def get(self, key): return None
                async def set(self, key, value, ex=None): return True
                async def close(self): pass
            return MockRedis()
        return self.redis_client

redis_manager = RedisManager()
