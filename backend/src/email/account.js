const api_key = process.env.SENDGRID_API_KEY;
const sgrid = require("@sendgrid/mail");
sgrid.setApiKey(api_key);
function sendEmailToUser(email, name) {
  sgrid.send({
    to: email,
    from: "abdussomad8720@gmail.com",
    subject: "this is from my course",
    text: `hi ${name} thank you for signing into our app`,
  });
}

module.exports = { sendEmailToUser };
