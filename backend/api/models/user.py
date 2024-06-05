from ..db import db

class UserModel(db.Model):
    __tablename__ = "User"

    id = db. Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(80), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), server_onupdate=db. func.now())

    @classmethod
    def find_by_username (cls, username):
        return cls.query.filter_by (username=username). first ()

    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=_id) .first()

    def save_to_db (self) :
        db.session.add(self)
        db.session.commit ()

    def delete_from_db (self) :
        db.session.delete(self)
        db.session.commit ()