var express = require("express");
var path = require("path");

var app = express();

// static 파일들(js, css, img)의 기본 디렉토리로서 상위 경로(../) 를 사용하겠다!
app.use(express.static(path.join(__dirname, "..")));

// 3000번 대에서 서버를 열고,
app.listen(3000, (err) => {
  if (err) return console.log(err);
  console.log("The server is listening on port 3000");
});

app.get("/flastagram/posts", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "post_list.html"));
});

app.get("/flastagram/post-create", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "post_create.html"));
});