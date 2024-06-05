# 아래의 줄에 jsonify 추가!
from flask import Flask, jsonify
from flask_restful import Api
from dotenv import load_dotenv

# 추가!
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from marshmallow import ValidationError

# 추가!
from .db import db
from .ma import ma
from .models import user

def create_app():
    app = Flask(__name__)
    load_dotenv(".env", verbose=True)
    app.config.from_object("config.dev")
    app.config.from_envvar("APPLICATION_SETTINGS")
    api = Api(app)
    
    # 추가!
    jwt = JWTManager(app)
    migrate = Migrate(app, db)

    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    
    # 추가!
    # Flask 2.3.x version 부터 before_first_request -> before_request로 변경
    @app.before_request
    def create_tables():
        db.create_all()
        
    # 추가!
    @app.errorhandler(ValidationError)
    def handle_marshmallow_validation(err):
        return jsonify(err.messages), 400

    
    return app