/**
 * form 을 선택하고 직렬화된 JSON 을 반환합니다.
 */
function getFormJson() {
  let loginForm = document.querySelector(".login-form");
  let data = new FormData(loginForm);
  let serializedFormData = serialize(data);
  return JSON.stringify(serializedFormData);
}

/**
 * form 데이터를 받아서 JSON으로 직렬화합니다.
 */
function serialize(rawFormData) {
  let result = {};
  for (let [key, value] of rawFormData) {
    let sel = document.querySelectorAll("[name=" + key + "]");
    if (sel.length > 1) {
      if (result[key] === undefined) {
        result[key] = [];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * 로그인 정보를 서버에 전송하고, 로컬 스토리지에 JWT를 저장합니다.
 */
async function submitLoginData() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: getFormJson(),
    redirect: "follow",
  };
  const response = await fetch(LOGIN_API_URL, requestOptions);
  if (response.status == 200) {
    loginResponse = await response.json();
    const access_token = loginResponse["access_token"];
    const refresh_token = loginResponse["refresh_token"];
    localStorage.setItem("ACCESS_TOKEN", access_token);
    localStorage.setItem("REFRESH_TOKEN", refresh_token);
    window.location.href = FRONTEND_SERVER_BASE_URL + "/flastagram/posts";
  } else {
    alert(JSON.stringify(await response.json()));
  }
}