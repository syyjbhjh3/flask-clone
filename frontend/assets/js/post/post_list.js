/**
 * jwt 에서 얻은 유저의 id 로 프로필 사진을 얻어옵니다.
 */
async function getProfileImagebyId(id) {
  url = MYPAGE_API_URL + `${id}/`;
  let myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: "GET",
    headers: myHeaders,
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
  let src = STATIC_FILES_API_URL + (await getProfileImagebyId(userId));
  profileElement[0].src = src;
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
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    let rawResult = await fetch(
      POST_LIST_API_URL + "?page=" + page,
      requestOptions
    );
    // 만약 액세스 토큰이 만료되었다면, 새로운 액세스 토큰을 받아옵니다.
    if (rawResult.status == 401) {
      getNewJWT();
    }
    rawResult = await fetch(
      POST_LIST_API_URL + "?page=" + page,
      requestOptions
    );

    // 만약 리프레시 토큰도 만료되었다면, 로그인 페이지로 리다이렉트 처리합니다.
    if (rawResult.status == 401) {
      window.location.href = LOGIN_FRONTEND_URL;
    }
    const result = rawResult.json();
    return result;
  } catch (error) {
    console.log(error);
  }
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
  authorImageValue, // 저자의 프로필 사진
  likerCountValue, // 게시물 좋아요 갯수
  isLikeValue // 게시물 좋아요 여부
) {
  div = getCopyDiv();
  let authorUpImg = div.children[0].children[0].children[0].children[0];
  let authorUpName = div.children[0].children[0].children[1];
  let feedImg = div.children[1];
  let authorDownName = div.children[2].children[3];
  let title = div.children[2].children[4];
  let content = div.children[2].children[5];
  let postTime = div.children[2].children[6];
  let likerCount = div.children[2].children[1];
  let isLike = div.children[2].children[0].children[0].children[0];

  div.id = idValue;
  title.innerText = titleValue;
  feedImg.src = feedImgValue;
  content.innerText = contentValue;
  authorUpName.innerText = authorNameValue;
  authorUpImg.src = authorImageValue;
  authorDownName.innerText = authorNameValue;
  likerCount.innerText = `${likerCountValue} Likes`;
  if (isLikeValue == false) {
    isLike.classList.add("fa-regular");
    isLike.classList.add("fa-heart");
  } else {
    isLike.classList.add("fa-solid");
    isLike.classList.add("fa-heart");
  }

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
      const image = STATIC_FILES_API_URL + result[i]["image"];
      // 게시물의 내용
      const content = result[i]["content"];
      // 저자의 이름
      const authorName = result[i]["author"]["username"];
      // 저자의 프로필 사진
      const authorImage = STATIC_FILES_API_URL + result[i]["author"]["image"];
      // 게시물 좋아요 개수
      const likerCount = result[i]["liker_count"];
      // 게시글 좋아요 여부
      const isLike = result[i]["is_like"];

      postDiv.append(
        getCompletedPost(
          (idValue = id),
          (titleValue = title),
          (feedImgValue = image),
          (contentValue = content),
          (authorNameValue = authorName),
          (authorImageValue = authorImage),
          (likerCountValue = likerCount),
          (isLikeValue = isLike)
        )
      );
    }
  });
}

/**
 * 게시물을 생성하기 위한 팝업창을 띄웁니다.
 */
function showPostCreateForm() {
  let width = 800;
  let height = 950;
  let left = window.screen.width / 2 - width / 2;
  let top = window.screen.height / 4;

  let windowStatus = `width=${width}, height=${height}, left=${left}, top=${top}, resizable=no, toolbars=no, menubar=no`;

  const url = POST_CREATE_FRONTEND_URL;

  window.open(url, "something", windowStatus);
}

/**
 * 프로필 정보를 수정하거나 조회하기 위한 팝업창을 띄웁니다.
 */
function showProfile() {
  let width = 800;
  let height = 950;
  let left = window.screen.width / 2 - width / 2;
  let top = window.screen.height / 4;

  let windowStatus = `width=${width}, height=${height}, left=${left}, top=${top}, resizable=no, toolbars=no, menubar=no`;

  const url = PROFILE_FORM_FRONTEND_URL;

  window.open(url, "something", windowStatus);
}

/**
 * 무한 스크롤을 수행합니다.
 */
function executeInfiniteScroll() {
  let pageCount = 1;
  let intersectionObserver = new IntersectionObserver(function (entries) {
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
  executeInfiniteScroll(); // 스크롤을 내릴 때마다 게시물을 로드 (무한스크롤)
  loadProfileImage(); // 네비게이션 바에 프로필 사진을 뿌려줍니다.
}

function toggleLikeButton(likeButton) {
  let postId = likeButton.parentElement.parentElement.parentElement.id;
  let likeElement = likeButton.parentElement.parentElement.children[1];
  let likeValue = parseInt(likeElement.innerText.replace(/[^0-9]/g, ""));
  if ($(likeButton).children().first().attr("class") == "fa-solid fa-heart") {
    // 좋아요 취소 요청을 보냄
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(`${POST_LIST_API_URL}${postId}/likes/`, requestOptions)
      .then((response) => response.text())
      .catch((error) => console.log("error", error));
    likeValue--;
    likeElement.innerText = `${likeValue} Likes`;
    $(likeButton).html($("<i/>", { class: "fa-regular fa-heart" }));
  } else {
    // 좋아요 요청을 보냄
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(`${POST_LIST_API_URL}${postId}/likes/`, requestOptions)
      .then((response) => response.text())
      .catch((error) => console.log("error", error));
    likeValue++;
    likeElement.innerText = `${likeValue} Likes`;
    $(likeButton).html($("<i/>", { class: "fa-solid fa-heart" }));
  }
}

main();