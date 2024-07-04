/**
 * 액세스 토큰이 localStorage 에 존재하지 않으면,
 * 로그인 페이지로 리다이렉트 처리합니다.
 */
function userLoginRedirectHandler() {
    if (!ACCESS_TOKEN) {
      if (window.location.href == LOGIN_FRONTEND_URL) {
      } else {
        window.location.href = LOGIN_FRONTEND_URL;
      }
    }
  }
  
  userLoginRedirectHandler();