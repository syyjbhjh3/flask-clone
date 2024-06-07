# 아래의 줄에 jsonify 추가!
from flask import Flask, jsonify
from flask_restful import Api
from dotenv import load_dotenv
from flask_cors import CORS

from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from marshmallow import ValidationError

from .db import db
from .ma import ma
from .models import user, post, comment

from .resources.post import PostList, Post
from .resources.user import UserRegister

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"*": {"origins": "*"}})
    load_dotenv(".env", verbose=True)
    app.config.from_object("config.dev")
    app.config.from_envvar("APPLICATION_SETTINGS")
    api = Api(app)
    jwt = JWTManager(app)
    migrate = Migrate(app, db)

    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    
    # Flask 2.3.x version 부터 before_first_request -> before_request로 변경
    @app.before_request
    def create_tables():
        db.create_all()
        
    @app.errorhandler(ValidationError)
    def handle_marshmallow_validation(err):
        return jsonify(err.messages), 400
    
    api.add_resource(PostList, "/posts/")
    api.add_resource(Post, "/posts/<int:id>")
    api.add_resource(UserRegister, "/register/")

    return app