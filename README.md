# flask-clone
Flask 연습용, Instagram Clone 코딩

참조 블로그 : https://www.gdsanadevlog.com/planguages/real-python-flask-%ec%9d%b8%ec%8a%a4%ed%83%80%ea%b7%b8%eb%9e%a8-%ed%81%b4%eb%a1%a0%ec%bd%94%eb%94%a9-instagram-clone-1/

## - Backend 구성
    - 가상환경 생성 : python -m venv venv
    - 가상환경 활성화 : source venv/bin/activate
    - 필요 라이브러리 - requirements/common.txt
      - 설치 방법 : pip install -r requirements/dev.txt
      - flask
      - flask-jwt-extended
      - python-dotenv
      - flask-restful
      - flask-migrate
      - flask-uploads
      - flask-marshmallow
      - mashmallow-sqlalchemy
      - flask_cors
    
    - dev.txt : common.txt의 패키지를 모두 설치하기 위한 파일
      - pip install dev.txt
    
    - Database
      - 최초 sqlite 생성 : flask db init
      - sqlite 적용, 컬럼 수정시에는 해당 명령어들만 입력
        - flask db migrate  
        - flask db upgrade
    
    - jwt
      - 당사자 간에 정보를 json 개체로 안전하게 전송하기 위한 간결하고 자체 포함된 방법을 정의하는 개방형 표준
      - jwt token 확인 사이트 : jwt.io

