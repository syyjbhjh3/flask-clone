// API 기본 URL들을 정의합니다.
const postListBseUrl = "http://127.0.0.1:5000/posts/";
// Image 경로
const imageRetrieveBseUrl = "http://127.0.0.1:5000/statics/";
// #TODO : .env 로 url 주소 얻어오기
/** Flask API 로부터 데이터를 가져옵니다.
 * TODO : GetData() 의 인자에 따라서 페이지를 다르게 가져오게 해야 합니다.
 * promise 객체를 반환합니다.
 */
async function getPostListDatafromAPI() {
  // TODO : 본 함수에서 페이지 id를 인자로 받아 원하는 페이지 띄울 수 있도록 처리
  try {
    const somePromise = await fetch(postListBseUrl);
    const result = somePromise.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}
/**
 * post Div 전체를 복사합니다.
 */
function copyDiv() {
  const postDiv = document.querySelector(".post");
  const newNode = postDiv.cloneNode(true);
  newNode.id = "copied-posts";
  postDiv.after(newNode);
}
/**
 * getPostListDatafromAPI() 로부터 게시물 목록 데이터를 불러옵니다.
 * 불러온 데이터 결과의 길이만큼 (페이지네이션 처리) 게시물을 반복해 그립니다.
 */
function loadPosts() {
  getPostListDatafromAPI()
    .then((result) => {
      for (let i = 0; i < result.length; i++) {
        copyDiv();
        // 커버 이미지 요소를 선택하고 그립니다.
        const coverImageElements = document.querySelector(".post-image");
        coverImageElements.src = imageRetrieveBseUrl + result[result.length - 1 - i]["image"];
        // 저자 이름 요소를 선택하고, 그립니다.
        const upAuthorElement = document.querySelector(".author-up");
        upAuthorElement.innerText =
          result[result.length - 1 - i]["author_name"];
        const downAuthorElement = document.querySelector(".author-down");
        downAuthorElement.innerText =
          result[result.length - 1 - i]["author_name"];
        // 제목 요소를 선택하고 그립니다.
        const titleElement = document.querySelector(".title");
        titleElement.innerText = result[result.length - 1 - i]["title"];
        // 내용 요소를 선택하고 그립니다.
        const contentElement = document.querySelector(".content");
        contentElement.innerText = result[result.length - 1 - i]["content"];
        // 게시물이 없다면 none 처리를 합니다.
        if (i == 0) {
          document.getElementById("copied-posts").style.display = "none";
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
loadPosts(); // 최종 함수 호출