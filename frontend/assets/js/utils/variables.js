// ACCESS_TOKEN, REFRES_TOKEN 값
let ACCESS_TOKEN = localStorage.getItem("ACCESS_TOKEN");
let REFRESH_TOKEN = localStorage.getItem("REFRESH_TOKEN");

// API 서버 기본 URL
const API_SERVER_BASE_URL = "http://127.0.0.1:5000";

// API 서버 기능별 URL
const POST_LIST_API_URL = API_SERVER_BASE_URL + "/posts/";
const STATIC_FILES_API_URL = API_SERVER_BASE_URL + "/statics/";
const LOGIN_API_URL = API_SERVER_BASE_URL + "/login/";
const REFRESH_TOKEN_API_URL = API_SERVER_BASE_URL + "/refresh/";
const MYPAGE_API_URL = API_SERVER_BASE_URL + "/mypage/";
const POST_IMAGE_UPLOAD_API_URL = API_SERVER_BASE_URL + "/upload/post/image/";
const PROFILE_IMAGE_UPLOAD_API_URL =
  API_SERVER_BASE_URL + "/upload/profile/image/";

// Frontend 서버 기본 URL
const FRONTEND_SERVER_BASE_URL = "http://" + window.location.host;

// Frontend 서버 기능별 URL
const LOGIN_FRONTEND_URL = FRONTEND_SERVER_BASE_URL + "/flastagram/login";
const PROFILE_FORM_FRONTEND_URL =
  FRONTEND_SERVER_BASE_URL + "/flastagram/profile";
const POST_LIST_FRONTEND_URL = FRONTEND_SERVER_BASE_URL + "/flastagram/posts";
const POST_CREATE_FRONTEND_URL =
  FRONTEND_SERVER_BASE_URL + "/flastagram/post-create";