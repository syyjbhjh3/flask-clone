/**
 * 사용자가 이미지 선택을 완료하면,
 * 1. 업로드한 이미지를 띄워주고
 * 2. 서버에 이미지를 업로드합니다.
 * 3. 이미지 업로드의 성공 여부에 따라 에러 메시지를 띄워줍니다.
 * 4. 이미지 업로드가 성공한다면 그것의 path 를 숨겨져 있는 input 태그의 value 로 넣어줍니다.
 */
async function getImageResponse(event) {
  loadPreviewImage(event);
  result = await submitImage();
  // 201로 성공적으로 이미지가 업로드되었다면,
  // 성공 메시지를 띄워주고 해당 이미지의 경로를 반환
  // 그렇지 않다면, 에러 메시지를 띄워줌
  let response = await result.json();
  if (result.status == 201) {
    alert(response["message"]);
    const path = response["path"];
    const imageInput = document.querySelector(".image");
    imageInput.setAttribute("value", path);
  } else {
    alert(JSON.stringify(response));
  }
}

/**
 * 업로드한 이미지를 미리 확인합니다.
 */
function loadPreviewImage(event) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var img = document.createElement("img");
    img.setAttribute("src", event.target.result);
    document.querySelector("div#preview-image").appendChild(img);
  };
  reader.readAsDataURL(event.target.files[0]);
}

/**
 * input 태그에서 선택한 이미지를 서버에 전송합니다.
 * fetch() 의 결과를 반환합니다.
 */
async function submitImage() {
  // 이미지 파일을 서버에 전송하기 위해 form 생성
  const fileInput = document.querySelector(".imagefile");
  const formData = new FormData();

  // header 설정
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);

  formData.append("image", fileInput.files[0]);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formData,
  };

  // 이미지 업로드 API 요청
  const result = await fetch(PROFILE_IMAGE_UPLOAD_API_URL, requestOptions);
  return result;
}

/**
 * form 태그 안에 있는 내용을 JSON 으로 변환합니다.
 */
function getFormJson() {
  let form = document.querySelector("#profile-form");
  let data = new FormData(form);
  let serializedFormData = serialize(data);
  return JSON.stringify(serializedFormData);
}

/**
 * form 태그 안에 있는 내용을 dictionary 형태로 반환합니다.
 */
function serialize(rawData) {
  let serializedData = {};
  for (let [key, value] of rawData) {
    console.log(value);
    if (key == "imagefile") {
      continue;
    }
    if (value == "") {
      serializedData[key] = null;
    }
    serializedData[key] = value;
  }
  console.log(serializedData);
  return serializedData;
}

/**
 * 정제된 데이터를 넣어 프로필 수정 요청을 보냅니다.
 */
async function submitProfileData() {
  // 인증을 위한 header 설정
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);
  myHeaders.append("Content-Type", "application/json");

  // 보낼 데이터 설정
  var raw = getFormJson();

  // 최종 옵션 설정
  var requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  // 프로필 정보 수정 요청
  userId = await decodeJWT(ACCESS_TOKEN)["user_id"];
  const response = await fetch(MYPAGE_API_URL + userId + "/", requestOptions);
  console.log(response.status);
  if (response.status == 200) {
    alert("프로필 사진 수정이 완료되었습니다.");
    window.close();
  } else {
    alert(JSON.stringify(await response.json()));
  }
}

/**
 * 회원정보 조회 API로부터 현재 로그인한 유저의 정보를 가져옵니다.
 */
async function getProfileDatafromAPI() {
  userId = await decodeJWT(ACCESS_TOKEN)["user_id"];
  try {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${ACCESS_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    let rawResult = await fetch(MYPAGE_API_URL + userId + "/", requestOptions);
    // 만약 액세스 토큰이 만료되었다면, 새로운 액세스 토큰을 받아옵니다.
    if (rawResult.status == 401) {
      getNewJWT();
    }
    rawResult = await fetch(MYPAGE_API_URL + userId + "/", requestOptions);

    // 만약 리프레시 토큰도 만료되었다면, 로그인 페이지로 리다이렉트 처리합니다.
    if (rawResult.status == 401) {
      window.location.href = LOGIN_FRONTEND_URL;
    }
    const result = rawResult.json();
    console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

getProfileDatafromAPI();

/**
 * API 로부터 가져온 정보로 팝업창의 프로필 정보를 채웁니다.
 */
async function loadProfileInformation() {
  const userInformationFromAPI = await getProfileDatafromAPI();
  let imageDiv = document.querySelector("#preview-image");
  imageDiv.style.backgroundImage = `url(${
    STATIC_FILES_API_URL + userInformationFromAPI["image"]
  })`;
  imageDiv.style.backgroundSize = "100% 100%";

  email = document.querySelector("#email-input");
  email.value = userInformationFromAPI["email"];
  username = document.querySelector("#username-input");
  username.value = userInformationFromAPI["username"];
  createdAt = document.querySelector("#created-at");
  createdAt.innerText = userInformationFromAPI["created_at"];
}

loadProfileInformation();