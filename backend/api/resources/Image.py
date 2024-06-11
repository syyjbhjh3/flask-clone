from flask_restful import Resource
from flask_uploads import UploadNotAllowed
from flask import request, send_file, send_from_directory, url_for
from flask_jwt_extended import jwt_required, get_jwt_identity
import time, traceback, os
from api.utils import image_upload
from api.schemas.image import ImageSchema

image_schema = ImageSchema()

class AbstractImageUpload(Resource):
    """
    이미지 업로드를 위한 클래스입니다.
    이 클래스를 상속받는 자식 클래스들은 다음의 공통 기능을 가집니다.
    - 자식 클래스에서 정의된 폴더명 (folder 변수) 아래에 이미지를 업로드합니다.
    - 이미지를 삭제합니다.

    해당 클래스를 상속받는 자식 클래스들은 folder 라는 변수를 필히 재정의해야 합니다.
    """

    def set_folder_name(self):
        """
        이미지가 저장될 폴더명을 재정의하고 싶다면,
        해당 메서드를 오버라이딩해야 합니다.
        """
        return None

    def post(self):
        """이미지를 업로드하기 위해 HTTP POST 메서드를 사용합니다."""
        data = image_schema.load(request.files)
        folder = self.set_folder_name()
        try:
            image_path = image_upload.save_image(data["image"], folder=folder)
            basename = image_upload.get_basename(image_path)
            return {
                "message": f"{basename}이미지가 성공적으로 업로드되었습니다.",
                "path": image_path,
            }, 201
        except UploadNotAllowed:
            extension = image_upload.get_extension(data["image"])
            return {"message": f"{extension} 는 적절하지 않은 확장자 이름입니다."}, 400

class PostImageUpload(AbstractImageUpload):
    """
    게시물 이미지를 업로드합니다.
    """

    def set_folder_name(self):
        return "post/" + time.strftime("%Y/%m/%d")


class ProfileImageUpload(AbstractImageUpload):
    """
    프로필 이미지를 업로드합니다.
    """

    def set_folder_name(self):
        return f"profile/{get_jwt_identity()}"

    @jwt_required()
    def post(self):
        return super(ProfileImageUpload, self).post()
    
class Image(Resource):
    def get(self, path):
        """
        이미지가 존재한다면 그것을 응답합니다.
        """
        filename = image_upload.get_basename(path)
        folder = image_upload.get_path_without_basename(path)

        if not image_upload.is_filename_safe(filename):
            return {"message": "적절하지 않은 파일명입니다."}, 400

        try:
            return send_file(image_upload.get_path(filename=filename, folder=folder))
        except FileNotFoundError:
            return {"message": "존재하지 않는 이미지 파일입니다."}, 404

    def delete(self, filename):
        """
        이미지가 존재한다면 그것을 삭제합니다.
        """
        filename = image_upload.get_basename(path)
        folder = image_upload.get_path_without_basename(path)

        if not image_upload.is_filename_safe(filename):
            return {"message": "적절하지 않은 파일명입니다."}, 400

        try:
            os.remove(image_upload.get_path(filename, folder=folder))
            return {"message": "이미지가 삭제되었습니다."}, 200
        except FileNotFoundError:
            return {"message": "이미지를 찾을 수 없습니다."}, 404
        except:
            traceback.print_exc()
            return {"message": "이미지 삭제에 실패하였습니다. 잠시 후 다시 시도해 주세요."}, 500