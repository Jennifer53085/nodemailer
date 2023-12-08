/*需要透過npm下載
1.express
2.ejs
3.nodemailer

之後下nodemon app.js可運行
*/

const express = require("express");
const session = require("express-session");
const authRouter = require("./routes/auth_to_email");

const app = express();

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

// 設定 EJS 模板引擎
app.set('view engine', 'ejs');

// 忽略 /favicon.ico 的請求
app.get('/favicon.ico', (req, res) => res.status(204));


app.get('/', (req, res) => {
  res.render('view', { pageTitle: '選一個方式寄信' });
});

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
  res.render("error",{ pageTitle: 'Error Page' });
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
