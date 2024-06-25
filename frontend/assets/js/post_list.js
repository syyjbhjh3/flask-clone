// API 기본 URL들을 정의합니다.
const postListBseUrl = "http://127.0.0.1:5000/posts/";
const imageRetrieveBseUrl = "http://127.0.0.1:5000/statics/";
const refreshTokenBseUrl = "http://127.0.0.1:5000/refresh/";
// localStorage 로부터 토큰을 가져옵니다.
let ACCESS_TOKEN = localStorage.getItem("access_token");
let REFRESH_TOKEN = localStorage.getItem("refresh_token");
/**
 * 액세스 토큰과 리프레시 토큰이 localStorage 에 존재하지 않으면,
 * 로그인 페이지로 리다이렉트 처리합니다.
 */
function handleUserLogin() {
  // localStorage 에 access_token 이 존재하지 않으면 리다이렉트
  if (!localStorage.getItem("access_token")) {
    window.location.href = "http://localhost:3000/flastagram/login";
  }
}

/**
 * loacalStorage 에 존재하는 리프레시 토큰으로,
 * 새로운 액세스 토큰과 리프레시 토큰을 받아옵니다.
 * 받아온 새로운 토큰들을 localStorage에 저장합니다.
 */
async function getNewJWT() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${REFRESH_TOKEN}`);
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
  };
  const refreshResponse = await (
    await fetch(refreshTokenBseUrl, requestOptions)
  ).json();
  const access_token = refreshResponse["access_token"];
  const refresh_token = refreshResponse["refresh_token"];
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
}

/**
 * Flask API 로부터 게시물 목록 데이터를 가져옵니다.
 * 만약, API 요청에 대한 응답 상태 코드가 401이라면,
 * 가지고 있는 리프레시 토큰으로 액세스 토큰을 재발급 요청한 후,
 * 게시물 목록 API 요청을 다시 보냅니다.
 * 그것에 대한 응답 상태 코드 또한 401이라면,
 * 로그인 페이지로 리다이렉트 처리합니다.
 */
async function getPostListDatafromAPI(page = 1) {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    let rawResult = await fetch(
      postListBseUrl + "?page=" + page,
      requestOptions
    );
    // 만약 액세스 토큰이 만료되었다면, 새로운 액세스 토큰을 받아옵니다.
    if (rawResult.status == 401) {
      getNewJWT();
    }
    rawResult = await fetch(postListBseUrl + "?page=" + page, requestOptions);
    // 만약 리프레시 토큰도 만료되었다면, 로그인 페이지로 리다이렉트 처리합니다.
    if (rawResult.status == 401) {
      window.location.href = "http://localhost:3000/flastagram/login";
    }
    const result = rawResult.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

/**
 * jwt에서 얻은 유저의 id로 프로필 사진을 얻어옵니다.
 */
async function getProfileImagebyId(id) {
  url = profileRetrieveUrl + `${id}/`;
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);
  myHeaders.append("Content-type", "application/json");

  let requestOptions = {
    method: "GET",
    headers: myHeaders
  };

  const profileResponse = await (await fetch(url, requestOptions)).json();
  return profileResponse["image"];
}

/**
 * 이미지 경로를 받아 프로필 사진 이미지에 뿌려줍니다.
 */
async function loadProfileImage() {
  userId = await decodeJWT(ACCESS_TOKEN)["user_id"];
  profileElement = document.getElementsByClassName("user-profile");
  let src = imageRetrieveBseUrl + (await getProfileImagebyId(userId));
  console.log(src);
  profileElement[0].src = src;
}

/**
 * post Div 전체를 복사해 반환합니다.
 */
function getCopyDiv() {
  const postDiv = document.querySelector(".post");
  const newNode = postDiv.cloneNode(true);
  newNode.id = "copied-post";
  newNode.style = "display=inline";
  return newNode;
}

/**
 * id, 제목, 내용, 저자, 사진을 받아 해당 div를 하나의 게시물로 완성합니다.
 */
function getCompletedPost(
  idValue, // 게시물의 id
  titleValue, // 게시물의 제목
  feedImgValue, // 게시물의 피드 이미지
  contentValue, // 게시물의 내용
  authorNameValue, // 저자의 이름
  authorImageValue // 저자의 프로필 사진
) {
  div = getCopyDiv();
  let authorUpImg = div.children[0].children[0].children[0].children[0];
  let authorUpName = div.children[0].children[0].children[1];
  let feedImg = div.children[1];
  let authorDownName = div.children[2].children[3];
  let title = div.children[2].children[4];
  let content = div.children[2].children[5];
  let postTime = div.children[2].children[6];
  div.id = idValue;
  title.innerText = titleValue;
  feedImg.src = feedImgValue;
  content.innerText = contentValue;
  authorUpName.innerText = authorNameValue;
  authorUpImg.src = authorImageValue;
  authorDownName.innerText = authorNameValue;
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
      // 게시물의 id
      const id = result[i]["id"];
      // 게시물의 제목
      const title = result[i]["title"];
      // 게시물의 피드 이미지
      const image = imageRetrieveBseUrl + result[i]["image"];
      // 게시물의 내용
      const content = result[i]["content"];
      // 저자의 이름
      const authorName = result[i]["author"]["username"];
      // 저자의 프로필 사진
      const authorImage = imageRetrieveBseUrl + result[i]["author"]["image"];
      postDiv.append(
        getCompletedPost(
          (idValue = id),
          (titleValue = title),
          (feedImgValue = image),
          (contentValue = content),
          (authorNameValue = authorName),
          (authorImageValue = authorImage)
        )
      );
    }
  });
}

/**
 * jwt 를 받아 BASE64URL 디코딩 합니다.
 */
function decodeJWT(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

/**
 * 프로필 정보를 수정하거나 조회하기 위한 팝업창을 띄웁니다.
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

/**
 * 무한 스크롤을 수행합니다.
 */
function executeInfiniteScroll() {
  let pageCount = 1;
  var intersectionObserver = new IntersectionObserver(function (entries) {
    if (entries[0].intersectionRatio <= 0) {
      return;
    }
    // 게시물을 더 로드합니다.
    loadMorePosts(pageCount);
    pageCount++;
  });
  intersectionObserver.observe(document.querySelector(".bottom"));
}

function main() {
  handleUserLogin(); // 로컬스토리지에 JWT가 존재하지 않는다면 로그인 페이지로 이동합니다.
  executeInfiniteScroll(); // 스크롤을 내릴 때마다 게시물을 로드 (무한스크롤)
  loadProfileImage(); // 네비게이션 바에 프로필 사진을 뿌려줍니다.
}
main();