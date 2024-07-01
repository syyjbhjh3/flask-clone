from ..db import db
from sqlalchemy.sql import func
from sqlalchemy import or_

post_to_liker = db.Table(
    "post_liker",
    db.Column(
        "user_id",
        db.Integer,
        db.ForeignKey("User.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    db.Column(
        "post_id",
        db.Integer,
        db.ForeignKey("Post.id", ondelete="CASCADE"),
        primary_key=True,
    )
)

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
    author = db.relationship("UserModel", backref="post_set")
    comment_set = db.relationship("CommentModel", backref="post", passive_deletes=True, lazy="dynamic")
    image = db.Column(db.String(255))
    liker = db.relationship(
        "UserModel",
        secondary = post_to_liker,
        backref = db.backref("post_to_liker", lazy="dynamic"),
        lazy = "dynamic",
    )

    @classmethod
    def find_by_id(cls, id):
        """
        데이터베이스에서 id 로 특정 게시물 찾기
        """
        return cls.query.filter_by(id=id).first()

    @classmethod
    def find_all(cls):
        return cls.query.all()
    
    @classmethod
    def filter_by_followed(cls, followed_users) :
        from api.models.user import UserModel
        
        if followed_users:
            return cls.query.filter(
                or_(cls.author == user for user in followed_users)
            ),order_by(PostModel.id.desc())
        return UserModel.query.filter(False)

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
    
    def update_to_db(self, data):
        for key, value in data.items():
            setattr(self, key, value)
        db.session.commit()
        
    def __repr__(self):
        return f"<Post Object : {self.title}>"
    
    def do_like(self, user):
        """
        특정 게시물에 좋아요를 누름
        """
        if not self.is_like(user):
            self.liker.append(user)
            db.session.commit()
            return self

    def cancel_like(self, user):
        """
        특정 게시물에 좋아요를 취소함
        """
        if self.is_like(user):
            self.liker.remove(user)
            db.session.commit()
            return self

    def is_like(self, user):
        """
        특정 게시물에 좋아요를 눌렀는지에 대한 여부 반환
        """
        return (
            self.liker.filter(post_to_liker.c.user_id == user.id).count() > 0
        )

    def get_liker_count(self):
        """
        특정 게시물의 좋아요 숫자를 반환
        """
        return self.liker.count()
    