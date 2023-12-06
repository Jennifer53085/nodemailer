const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const googleOAuth2Client = require("../googleOAuth2Client");

const SCOPES = ["https://mail.google.com/"];

router.get("/login", (req, res) => {
  const authUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await googleOAuth2Client.getToken(code);

    googleOAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;
    // 直接調用sendEmail來發送郵件
    sendEmail(req, res);
  } catch (err) {
    console.error("Error authenticating with Google:", err);
    res.status(500).send("Error authenticating with Google");
  }
});

// 抽取發送郵件邏輯為獨立的函數
const sendEmail = (req, res) => {
  const { refresh_token, access_token } = req.session.tokens;

  // 串google的OAuth寫法
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "擁有OAuth2.0API的google帳號",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: refresh_token,
      accessToken: access_token,
    },
  });
  // 串其他公司的SMTP server寫法
  // const transporter = nodemailer.createTransport({
  //   host: 'mail.domain.com', // 公司Server
  //   port: 25,
  //   auth: {
  //     user: 'yourcompany@email',
  //     pass: 'password',
  //   },
  // });

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

  const mailOptions = {
    from: "寄信信箱",
    to: ["收信信箱", "多個就是使用array呈現"],
    subject: `${unit} 第${shift}班 第${bed}床血管通路異常提醒`,
    html: `
    <p>${unit}-${bed}  第${shift}班 ${pid} ${name}</p>
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
  };

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

module.exports = router;
