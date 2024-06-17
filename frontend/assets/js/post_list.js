// API 기본 URL들을 정의합니다.
const postListBseUrl = "http://127.0.0.1:5000/posts/";
const imageRetrieveBseUrl = "http://127.0.0.1:5000/statics/";

/** Flask API 로부터 데이터를 가져옵니다.
 * promise 객체를 반환합니다.
 */
async function getPostListDatafromAPI(page = 1) {
  try {
    const somePromise = await fetch(postListBseUrl + "?page=" + page);
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
  newNode.id = "copied-post";
  postDiv.after(newNode);
}

/**
 * getPostListDatafromAPI() 로부터 게시물 목록 데이터를 불러옵니다.
 * 불러온 데이터 결과의 길이만큼 (페이지네이션 처리) 게시물을 반복해 그립니다.
 */
function loadPosts(page = 1) {
  getPostListDatafromAPI((page = page))
    .then((result) => {
      for (let i = 0; i < result.length; i++) {
        copyDiv();
        // 커버 이미지 요소를 선택하고 그립니다.
        const coverImageElements = document.querySelector(".post-image");
        coverImageElements.src =
          imageRetrieveBseUrl + result[result.length - 1 - i]["image"];
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
          document.getElementById("copied-post").style.display = "none";
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * post Div 전체를 복사해 반환합니다.
 */
function getCopyDiv() {
  const postDiv = document.querySelector(".post");
  const newNode = postDiv.cloneNode(true);
  newNode.id = "copied-post";
  return newNode;
}

/**
 * 제목, 내용, 저자, 사진을 받아 해당 div를 하나의 게시물로 완성합니다.
 */
function getCompletedPost(
  titleValue,
  contentValue,
  authorNameValue,
  feedImgValue
) {
  div = getCopyDiv();
  let authorUpImg = div.children[0].children[0].children[0];
  let authorUpName = div.children[0].children[0].children[1];
  let feedImg = div.children[1];
  let authorDownName = div.children[2].children[3];
  let title = div.children[2].children[4];
  let content = div.children[2].children[5];
  let postTime = div.children[2].children[6];

  title.innerText = titleValue;
  content.innerText = contentValue;
  authorUpName.innerText = authorNameValue;
  authorDownName.innerText = authorNameValue;
  feedImg.src = feedImgValue;

  return div;
}

/**
 * 게시물 데이터를 받아온 다음,
 * 일정한 조건이 되면 호출되는 메서드입니다.
 * 페이지를 받아서, 적절한 데이터를 받아 화면에 그립니다.
 */
function loadMorePosts(page) {
  getPostListDatafromAPI(page).then((result) => {
    const postDiv = document.querySelector(".post-wrapper");
    for (let i = 0; i < result.length; i++) {
      const title = result[i]["title"];
      console.log(i);
      const content = result[i]["content"];
      const author = result[i]["author_name"];
      const image = imageRetrieveBseUrl + result[i]["image"];

      postDiv.append(
        getCompletedPost(
          (titleValue = title),
          (contentValue = content),
          (authorNameValue = author),
          (feedImgValue = image)
        )
      );
    }
  });
}

function executeInfiniteScroll() {
  let pageCount = 2;
  var intersectionObserver = new IntersectionObserver(function (entries){
    if (entries[0].intersectionRatio <= 0) return;
  
    loadMorePosts(pageCount);
    pageCount++;
  });
  intersectionObserver.observe(document.querySelector(".bottom"));
}

/**
 *  프로필 정보를 수정하거나 조회하기 위한 팝업창을 띄웁니다.
 */
function showProfile() {
  var width = 800;
  var height = 950;
  var left = window.screen.width / 2 - width / 2;
  var top = window.screen.height / 4;

  var windowStatus = `width=${width}, height=${height}, left=${left}, top=${top}, resizable=no, toolbars=no, menubar=no`;

  const url = "http://localhost:3000/flastagram/profile";

  window.open(url, "something", windowStatus);
}

function main() {
  loadPosts(1);
  executeInfiniteScroll();
}

main();