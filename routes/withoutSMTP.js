const express = require("express");
const router = express.Router();
const sendmail = require('sendmail')({
    logger: {
      debug: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    },
    silent: false,
    devPort: 1025, //透過MailDev開發
    devHost: 'localhost', // Default: localhost
    smtpPort: 25, // Default: 25(選填)
    smtpHost: 'mail.vghtpe.gov.tw' // Default: -1 - extra smtp host after resolveMX(選填)
  })

//   MailDev是一個開發和測試的本地郵件伺服器，web介面 http://localhost:1080/


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
  from: "tchen2@vghtpe.gov.tw",
  to: ["jennifer53085@gmail.com","test@vghtpe.gov.tw"],
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

  router.get("/", (req, res) => {
    try {
        sendmail(mailOptions, function (err, reply) {
            console.log(err && err.stack)
            console.dir(reply)
        })

        res.json({ success: true, message: 'the way of sending Email without SMTP.' });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Error");
    }
});

module.exports = router;