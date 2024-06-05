import email
import os
from urllib import response
import api
import unittest
import tempfile
from api.db import db
from dotenv import load_dotenv
from api.models.post import PostModel
from api.models.user import UserModel
from sqlalchemy.orm import Session


class CommonTestCaseSettings(unittest.TestCase):
    """
    테스트를 위한 공통 셋업
    """

    def setUp(self):
        """
        테스트를 위한 사전 준비
        backend/config/test.py 를 사용
        .env 파일의 APPLICATION_SETTINGS_FOR_TEST 환경 변수 사용
        app.test_client() 로 테스트를 위한 클라이언트 생성
        테스트를 위한 임의의 유저 한 명 생성
        """
        self.app = api.create_app()
        self.ctx = self.app.app_context()
        self.ctx.push()
        load_dotenv(".env", verbose=True)
        self.app.config.from_object("config.test")
        self.app.config.from_envvar("APPLICATION_SETTINGS_FOR_TEST")
        self.app.config.update(RESTFUL_JSON=dict(ensure_ascii=False))
        self.client = self.app.test_client()
        db.create_all()
        UserModel(username="test_user", password="12345", email="test@example.com").save_to_db()

    def tearDown(self):
        """
        테스트가 끝나고 수행되는 메서드, 데이터베이스 초기화
        """
        db.session.remove()
        db.drop_all()


class PostListTestCase(CommonTestCaseSettings):
    """
    /posts 에 대한 GET, POST 요청을 테스트한다.

    GET  /posts -> 모든 게시물의 목록을 반환
    POST /posts -> 새로운 게시물을 하나 생성
    """

    def test_get_post_list(self):
        """
        1. 임의의 게시물 100개를 생성하고, /posts 에 요청을 보냄
        2. 임의의 게시물의 형태는 (제목:1번째 테스트 게시물입니다. / 내용:1번째 테스트 게시물의 내용입니다) 와 같은 형태가 될 것임
        3. /posts 에 요청을 보내면, 게시물의 목록이 나타나야 함
        4. 게시물의 목록은 10개씩, 역 pk 순으로 페이지네이션 처리되어야 함
        5. 고로, 첫 번째 게시물의 id 는 100이어야 함
        6. 첫 번째 페이지의 마지막 게시물의 id는 91이어야 함
        """

        # 임의의 게시물 100개 생성
        dummy_posts = []
        for i in range(100):
            dummy_posts.append(
                PostModel(
                    title=f"{i+1}번째 테스트 게시물입니다.", content=f"{i+1}번째 테스트 게시물의 내용입니다.", author_id=1
                )
            )
        db.session.bulk_save_objects(dummy_posts)
        db.session.commit()

        # 게시물의 첫 번째 페이지로 요청을 보낸다.
        response = self.client.get("http://127.0.0.1:5000/posts/").get_json()

        # 게시물 목록의 맨 첫 번째 게시물의 id 는 100이어야 한다.
        self.assertEqual(100, response[0]["id"])

        # 게시물 목록의 맨 마지막 게시물의 id 는 91 이어야 한다.
        self.assertEqual(91, response[-1]["id"])
        
        # 게시물의 두 번째 페이지로 요청을 보낸다.
        response = self.client.get("http://127.0.0.1:5000/posts/?page=2").get_json()

        # 게시물 목록의 두 번째 페이지의 맨 첫 번째 게시물의 id 는 90이어야 한다.
        self.assertEqual(90, response[0]["id"])

        # 게시물 목록의 맨 마지막 게시물의 id 는 81 이어야 한다.
        self.assertEqual(81, response[-1]["id"])

if __name__ == "__main__":
    unittest.main()