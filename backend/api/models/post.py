from ..db import db
from sqlalchemy.sql import func


class PostModel(db.Model):
    """
    Flastagram 게시물 모델

    title       : 게시물의 제목, 150자 제한
    content     : 게시물의 내용, 500자 제한
    created_at  : 게시물의 생성일자, 기본적으로 현재가 저장
    updated_at  : 게시물의 생성일자, 게시물이 수정될 때마다 업데이트
    author_id   : 게시물의 저자 id, 외래 키
    comment_set : 게시물에 달린 댓글들
    """

    __tablename__ = "Post"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150))
    content = db.Column(db.String(500))
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), default=func.now(), onupdate=func.now())
    author_id = db.Column(db.Integer, db.ForeignKey("User.id", ondelete="CASCADE"), nullable=False)
    author = db.relationship("UserModel", backref="post_author")
    comment_set = db.relationship("CommentModel", backref="post", passive_deletes=True)

    @classmethod
    def find_by_id(cls, id):
        """
        데이터베이스에서 id 로 특정 게시물 찾기
        """
        return cls.query.filter_by(id=id).first()

    @classmethod
    def find_all(cls):
        return cls.query.all()

    def save_to_db(self):
        """
        게시물을 데이터베이스에 저장
        """
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        """
        게시물을 데이터베이스에서 삭제
        """
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"<Post Object : {self.title}>"