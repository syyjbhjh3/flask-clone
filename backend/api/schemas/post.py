from api.ma import ma, Method
from api.models.post import PostModel

# You, 1 second ago | 1 author (You)
class PostSchema (ma.SQLAlchemyAutoSchema) :
    # 게시물 모델에 관한 직렬화 규칙 정의
    author_name = Method("get_author_name")
    
    def get_author_name (self, obj) :
        return obj.author.username
    
    class Meta:
        model = PostModel
        # 보기 전용 필드들을 정의
        dump_only = [
            "author_name",
        ]
        # 쓰기 전용 필드들을 정의
        # load_only = [
        #    "author_id",
        # ]
        exclude = ("author_id",)
        load_instance = True
        include_fk = True
        ordered = True
