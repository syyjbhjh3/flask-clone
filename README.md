# flask-clone
Flask 연습용, Instagram Clone 코딩


- Backend 구성
    - 가상환경 생성 : python -m venv venv
    - 가상환경 활성화 : source venv/bin/activate
    - 필요 라이브러리 - requirements/common.txt
      - flask
      - flask-jwt-extended
      - python-dotenv
      - flask-restful
      - flask-migrate
      - flask-uploads
      - flask-marshmallow
      - mashmallow-sqlalchemy
    - dev.txt : common.txt의 패키지를 모두 설치하기 위한 파일
      - pip install dev.txt
    - Database
      - flask db init
      - flask db migrate
      - flask db upgrade
    