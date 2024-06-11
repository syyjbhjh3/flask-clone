import os, re
from typing import Union
from werkzeug.datastructures import FileStorage
from flask_uploads import UploadSet, IMAGES

IMAGE_SET = UploadSet("images", IMAGES)


def save_image(image, folder, name=None):
    """FileStorage 인스턴스를 받아서, 폴더에 저장합니다."""
    return IMAGE_SET.save(image, folder, name)


def get_path(filename, folder):
    """filename, folder 를 받아 이미지의 절대 경로를 반환합니다."""
    return IMAGE_SET.path(filename, folder)


def find_image_any_format(filename, folder):
    """
    확장자가 없는 파일 이름과 찾고자 하는 폴더명을 받아, 해당 폴더에 이미지가 존재하는지를 반환합니다.
    """
    for _format in IMAGES:
        image = f"{filename}.{_format}"
        image_path = IMAGE_SET.path(filename=image, folder=folder)
        if os.path.isfile(image_path):
            return image_path
    return None


def _retrieve_filename(file):
    """
    FileStorage 오브젝트를 받아 파일 이름을 반환합니다.
    """
    if isinstance(file, FileStorage):
        return file.filename
    return file


def is_filename_safe(file):
    """
    파일 이름이 안전한지를 확인합니다.
    - a-z, 혹은 A-Z 로 시작해야만 합니다.
    - a-z A-Z 0-9 and _().- 외의 문자는 포함될 수 없습니다.
    - . 이후에는, 우리가 허용한 확장자만 와야 합니다.
    """
    filename = _retrieve_filename(file)
    allowed_format = "|".join(IMAGES)
    regex = f"^[a-zA-Z0-9][a-zA-Z0-9_()-\.]*\.({allowed_format})$"
    return re.match(regex, filename) is not None


def get_basename(file):
    """
    파일의 기본 이름을 가져옵니다.
    get_basename('images/profiles/hello.png') 는 'hello.png' 를 반환할 겁니다.
    """
    filename = _retrieve_filename(file)
    return os.path.split(filename)[1]


def get_extension(file):
    """
    파일의 확장자명을 가져옵니다.
    get_extension('profile.png') 는 'png' 를 반환할 겁니다.
    """
    filename = _retrieve_filename(file)
    return os.path.splitext(filename)[1]

def get_path_without_basename(path):
    """
    파일의 확장자명을 제외하고 경로를 반환합니다.
    예를 들면, get_path_without_basename('hello/world/brothers.jpg') 는,
    'hello/world/' 를 반환할 겁니다.
    """
    return "/".join(path.split("/")[:-1])
