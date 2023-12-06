const express = require("express");
const session = require("express-session");
const authRouter = require("./routes/auth_to_email");

const app = express();

//gmail api從下面網址開始使用這個網頁進行登入
// http://localhost:3000/auth/login

// Express 產生器並沒有啟用 session 功能
app.use(
  session({
    secret: "Tzu Ning's Test",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      // 七天
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use("/auth", authRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
