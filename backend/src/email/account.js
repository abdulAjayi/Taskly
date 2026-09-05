const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

function sendEmailToUser(email, name) {
  return resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: email,
    subject: "Welcome to GREENPEG IIoT",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2 style="color:#167A3E">GREENPEG IIoT</h2>
        <p>Hi ${name}, thank you for signing up!</p>
      </div>
    `,
  });
}

module.exports = { sendEmailToUser };
