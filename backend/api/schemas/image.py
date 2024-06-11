from marshmallow import Schema, fields
from werkzeug.datastructures import FileStorage


class FileStorageField(fields.Field):
    default_error_messages = {"error": "유효한 이미지 파일이 아닙니다."}

    def _deserialize(self, value, attr, data, **kwargs):
        if value is None:
            return None

        if not isinstance(value, FileStorage):
            self.fail("invalid")

        return value


class ImageSchema(Schema):
    image = FileStorageField(required=True)