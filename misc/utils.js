const nodemailer = require('nodemailer');
require('dotenv').config();
const randomize = require('randomatic');

function timeNow(separator = '-') {
  const d = new Date(Date.now());
  let date = d.toLocaleDateString('hu-HU');
  date = date.replace(/(\.)/g, '');
  return date.replace(/ /g, separator);
}

function isUpcoming(date) {
  const now = new Date(Date.now());
  const d = new Date(date);
  const oneDay = (1000 * 60 * 60 * 24); // 1 day in ms
  return now.getTime() <= (d.getTime() + oneDay);
}

function hashCode(id) {
  const str = `${id.toString()}aa`;
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
}

function intToRGB(i) {
  // eslint-disable-next-line no-bitwise
  const c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
}

function color(str) {
  const hash = hashCode(str);
  return intToRGB(hash);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function textColor(str) {
  const rgb = hexToRgb(str);
  const brightness = Math.round(
    (
      (parseInt(rgb.r, 10) * 299) + (parseInt(rgb.g, 10) * 587) + (parseInt(rgb.b, 10) * 114)
    ) / 1000,
  );
  return (brightness > 125) ? 'black' : 'white';
}

function displayEllapsedTime(updated) {
  const d = new Date();
  const year = d.getYear() - updated.getYear();
  const month = d.getMonth() - updated.getMonth();
  const day = d.getDate() - updated.getDate();
  const hours = d.getHours() - updated.getHours();
  const mins = d.getMinutes() - updated.getMinutes();

  if (year > 1) return `${year} YEARS AGO`;
  if (year === 1) return `${year} YEAR AGO`;

  if (month > 1) return `${month} MONTHS AGO`;
  if (month === 1) return `${month} MONTH AGO`;

  if (day > 1) return `${day} DAYS AGO`;
  if (day === 1) return `${day} DAY AGO`;

  if (hours > 24) return '1 DAY AGO';
  if (hours > 1) return `${hours} HOURS AGO`;
  if (hours === 1) return '1 HOUR AGO';

  if (hours === 0) {
    if (mins === 1) return '1 MIN AGO';
    if (mins === 0) return 'JUST NOW';
    return `${mins} MINS AGO`;
  }

  return 'JUST NOW';
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    return null;
  }
  return date.toLocaleString('hu-HU', {
    day: 'numeric',
    month: 'short',
    // year: "numeric",
    hour: 'numeric',
    minute: '2-digit',
  });
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function isExpired(month, day) {
  const date = new Date();

  if (month <= date.getMonth()) {
    if (month === date.getMonth()) {
      return (day < date.getDate());
    }
    return true;
  }
  return false;
}

function sendMail(mail, subjecttext, bodytext, toemail, toname) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.eu.mailgun.org',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.NODE_ENV ? process.env.MG_USER_2 : '',
      pass: process.env.NODE_ENV ? process.env.MG_BIRO_WTF_P : '',
    },
  });

  const mailOptions = {
    from: `${mail}@biro.wtf`,
    to: toemail,
    subject: subjecttext,
    text: `Hi ${toname}! ${bodytext}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return false;
    }
    console.log(`Email sent: ${info.response}`);
    return true;
  });
}

function generateCodes(quantity, length) {
  const codes = [];

  if (!quantity || Number(quantity) < 1 || !length || Number(length) < 1) return codes;

  for (let i = 0; i < Number(quantity); i += 1) {
    let codeFound = false;
    let newcode = '';

    while (!codeFound) {
      newcode = randomize('A0', Number(length));
      let flagForUnique = false;

      for (let j = 0; j < codes.length; j += 1) {
        if (String(newcode) === String(codes[j])) {
          flagForUnique = true;
        }
      }

      if (!flagForUnique) codeFound = true;
    }

    codes.push(newcode);
  }

  return codes;
}

module.exports = {
  color,
  textColor,
  displayET: displayEllapsedTime,
  formatDate,
  sleep,
  isExpired,
  sendMail,
  generateCodes,
  timeNow,
  isUpcoming,
};
