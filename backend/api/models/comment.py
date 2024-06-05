from ..db import db
from sqlalchemy.sql import func


class CommentModel(db.Model):
    """
    Flastagram 댓글 모델
    
    content    : 댓글의 내용
    created_at : 댓글의 생성일자
    updated_at : 댓글의 수정일자
    author_id  : 해당 댓글의 저자 id
    post_id    : 해당 댓글의 게시물 id
    """
    __tablename__ = "Comment"
       
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text(), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    author_id = db.Column(db.Integer, db.ForeignKey('User.id', ondelete='CASCADE'), nullable=False)
    author = db.relationship("UserModel", backref="comment_author")
    post_id = db.Column(db.Integer, db.ForeignKey('Post.id', ondelete='CASCADE'), nullable=False)
    
    def save_to_db(self):
        """
        댓글을 데이터베이스에 저장
        """
        db.session.add(self)
        db.session.commit()
        
    def delete_from_db(self):
        """
        댓글을 데이터베이스에서 삭제
        """
        db.session.delete(self)
        db.session.commit()
        
    @classmethod
    def find_by_id(cls, id):
        """
        데이터베이스에서 id 로 특정 댓글 찾기
        """        
        return cls.query.filter_by(id=id).first()
        
    def __repr__(self):
        return f'<Comment Object : {self.content}>'