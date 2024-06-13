from flask_jwt_extended import get_jwt_identity
from flask_restful import Resource, request
from marshmallow import ValidationError
from api.models.post import PostModel
from api.models.user import UserModel
from api.models.comment import CommentModel

class CommentList(Resource):
    @classmethod
    def get(cls, post_id):
        post = PostModel.find_by_id(post_id)
        
        ordered_comment_list = post.comment_set.order_by(
            CommentModel.id.desc()
        )
        return comment_list_schema.dump(ordered_comment_list)
    
    @classmethod
    def post(cls, post_id):
        comment_json = request.get_json()
        
        username = get_jwt_identity()
        author_id = UserModel.find_by_username(username).id
        try:
            new_comment = comment_schema.load(comment_json)
            new_comment.author_id = author_id
            new_comment.post_id = post_id
        except ValidationError as err:
            return err.messages, 400
        try:
            new_comment.save_to_db()
        except:
            return {"Error": "저장에 실패하였습니다."}, 500
        return comment_schema.dump(new_comment), 201
    
class CommentDetail(Resource):
    @classmethod
    def put(cls, post_id, comment_id):
        pass
    
    @classmethod
    def delete(cls, post_id, comment_id):
        pass