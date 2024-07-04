/**
 * loacalStorage 에 존재하는 리프레시 토큰으로,
 * 새로운 액세스 토큰과 리프레시 토큰을 받아옵니다.
 * 받아온 새로운 토큰들을 localStorage에 저장합니다.
 */
async function getNewJWT() {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${REFRESH_TOKEN}`);
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
    };
    const refreshResponse = await (
      await fetch(REFRESH_TOKEN_API_URL, requestOptions)
    ).json();
    const access_token = refreshResponse["access_token"];
    const refresh_token = refreshResponse["refresh_token"];
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
  }