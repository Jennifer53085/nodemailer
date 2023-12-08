const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const googleOAuth2Client = require("../googleOAuth2Client");

const SCOPES = ["https://mail.google.com/"];

// 模擬變數
let unit = "我太美病房";
let shift = "1";
let bed = "1";
let name = "林北新園結依";
let pid = "0053180561";
let path = "AVG Lt";
let problem = "透析不易止血、紅腫熱痛";
let ishealing = true;
let isOurhospital = false;
let time = new Date();
let pta_time = "2023/12/6";

const formatDate = (date) => {
  const addZero = (num) => (num = num < 10 ? `0${num}` : num);

  let year = date.getFullYear();
  let month = addZero(date.getMonth() + 1);
  let day = addZero(date.getDate());
  let hour = addZero(date.getHours());
  let minute = addZero(date.getMinutes());

  return `${year}-${month}-${day} ${hour}:${minute}`;
};

// 自訂信件內容
const mailOptions = {
  from: "wps.fyc@gmail.com",
  to: "jennifer53085@gmail.com",
  subject: `${unit} 第${shift}班 第${bed}床血管通路異常提醒`,
  html: `
    <p>${unit}-${bed} 第${shift}班 ${pid} ${name}</p>
    <hr/>
      <p >於<span style="color: red; font-size: 16px;">${path}</span>出現<span style="color: red; font-size: 16px;">${problem}</span>，近三個月${
    ishealing ? `有於${isOurhospital ? "本院" : "外院"}` : "無"
  }介入治療。</p>
      ${
        ishealing && !isOurhospital
          ? `<p>外院備註:<ul>
      <li>PTA:${pta_time}</li>
      <li>去栓手術:${pta_time}</li>
      <li>重建手術:${pta_time}</li>
      </ul></p>`
          : ""
      }
      <hr/>
      <p>通報異常填寫時間:${formatDate(time)}</p>`,
  text: "可以使用html或是text設定信件內容",
};

// 1.OAuth寄信方法
const sendEmailbyOAuth = (req, res) => {
  const { refresh_token, access_token } = req.session.tokens;

  // 串google的OAuth
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "擁有OAuth2.0API的google帳號",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: refresh_token,
      accessToken: access_token,
    },
  });

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error sending email");
    } else {
      console.log(info);
      res.send("Email sent");
    }
  });
};

// 2.使用其他SMTP相關設定寄信方法
const sendEmailbySMTP = () => {
  //使用gmail的app password來進行SMTP寄信寫法
  //  app password在帳號設定裡面，點擊安全性設定雙因子驗證之後進到雙因子驗證頁面最底層那裡
  const transporterGoogle = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "wps.fyc@gmail.com",
      pass: "esnyxeiuuscqimxy",
    },
  });

  // 串其他公司的SMTP server寫法
  const transporterOther = nodemailer.createTransport({
    host: 'mail.domain.com', // 公司Server
    port: 25,
    auth: {
      user: 'yourcompany@email',
      pass: 'password',
    },
  });

  transporterGoogle.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error sending email");
    } else {
      console.log(info);
      res.send("Email sent");
    }
  });
};


//1-1.透過google OAuth2.0的方法(需要先進行google登入才可以寄信)
router.get("/login", (req, res) => {
  const authUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.redirect(authUrl);
});
//1-2.接收google OAuth2.0重新導入後須要做的事情
router.get("/google/callback", (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = googleOAuth2Client.getToken(code);

    googleOAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;
    // 直接調用sendEmail來發送郵件
    sendEmailbyOAuth(req, res);
     // 返回 JSON 格式的回應
     res.json({ success: true, message: 'Email sent via OAuth.' });
  } catch (err) {
    console.error("Error authenticating with Google:", err);
    res.status(500).send("Error authenticating with Google");
  }
});

// 2.透過SMTP的方法
router.get("/emailbySMTP", async (req, res) => {
  try {
    // 直接調用sendEmail來發送郵件
    sendEmailbySMTP();
     // 返回 JSON 格式的回應
     res.json({ success: true, message: 'Email sent via SMTP.' });
  } catch (err) {
    console.error("Error authenticating with SMTP:", err);
    res.status(500).send("Error authenticating with SMTP");
  }
});

module.exports = router;
