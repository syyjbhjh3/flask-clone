from flask import Flask
from flask restful import Api
from dotenv import load_dotenv

def create_app():
    app = Flask(__name__)
    load_dotenv(".env", verbose=True)
    app.config.from_object("config.dev")
    app.config.from_envvar("APPLICATION_SETTINGS")
    api = Api(app)

    @app.route('/')
    def home ():
        return "home..."

    return app