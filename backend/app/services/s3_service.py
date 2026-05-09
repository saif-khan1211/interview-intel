import asyncio

import boto3
from botocore.exceptions import ClientError

from app.config import settings

_s3_client = None


def _get_s3_client():
    global _s3_client
    if _s3_client is None:
        _s3_client = boto3.client(
            "s3",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )
    return _s3_client


def _upload_sync(file_bytes: bytes, s3_key: str, content_type: str) -> None:
    client = _get_s3_client()
    client.put_object(
        Bucket=settings.s3_bucket_name,
        Key=s3_key,
        Body=file_bytes,
        ContentType=content_type,
        ServerSideEncryption="AES256",
    )


async def upload_file(file_bytes: bytes, s3_key: str, content_type: str) -> str:
    await asyncio.to_thread(_upload_sync, file_bytes, s3_key, content_type)
    return s3_key


def _presigned_url_sync(s3_key: str, expiry: int) -> str:
    client = _get_s3_client()
    return client.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.s3_bucket_name, "Key": s3_key},
        ExpiresIn=expiry,
    )


async def get_presigned_url(s3_key: str, expiry: int = 3600) -> str:
    return await asyncio.to_thread(_presigned_url_sync, s3_key, expiry)
