from api.models.user import UserModel
from flask_restful import Resource, request
from api.schemas.user import UserRegisterSchema
from werkzeug.security import generate_password_hash

register_schema = UserRegisterSchema()
class UserRegister(Resource):
    """
    회원가입을 처리합니다.
    username, email 은 데이터베이스에서 유일한 값이어야 하므로,
    사용자가 데이터베이스에 존재하는 email 이나 username 으로 회원가입을 시도한다면,
    적절한 에러 메시지와 함께 "잘못된 요청을 보냈어!" 라는 400 상태 코드를 응답합니다.
    비밀번호는 데이터베이스에 직접 저장되면 안 되므로,
    저장 시 SHA256 알고리즘을 사용하여 해싱하여 저장합니다.
    """
    def post(self):
        data = request.get_json()
        validate_result = register_schema.validate(data)
        if validate_result:
            return validate_result, 400
        else:
            if UserModel.find_by_username(data["username"]):
                return {"bad request": "중복된 사용자 이름입니다."}, 400
            elif UserModel.find_by_email(data["email"]):
                return {"message": "중복된 이메일입니다."}, 400
            else:
                password = generate_password_hash(data["password"])
                # print(len(password))
                user = register_schema.load(
                    {
                        "username": data["username"],
                        "email": data["email"],
                        "password": password,
                        "password_confirm": password
                    }
                )
            user = register_schema.load(data)
            user.save_to_db()
            return {"success": f"{user.username} 님, 가입을 환영합니다!"}, 201