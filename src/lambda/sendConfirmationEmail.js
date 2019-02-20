import sgMail from "@sendgrid/mail";
import Cryptr from "cryptr";

const cryptr = new Cryptr("secret");
const url = "http://localhost:9000";
const addRecipientUrl = `${url}/addRecipient`;
const getAddRecipientUrl = id => `${addRecipientUrl}?id=${id}`;

const { SENDGRID_APIKEY } = process.env;
sgMail.setApiKey(SENDGRID_APIKEY);

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // When the method is POST, the name will no longer be in the event’s
  // queryStringParameters – it’ll be in the event body encoded as a query string
  const data = JSON.parse(event.body);
  const id = cryptr.encrypt(JSON.stringify(data));

  const msg = {
    to: data.email,
    from: "no-reply@muhajirframe.com",
    subject: "Sending test with sendgrid",
    text: `Please click this link to subscribe ${getAddRecipientUrl(id)}`,
    html: `<p>Please click this link to subscribe <br> ${getAddRecipientUrl(
      id
    )}</p>`
  };

  await sgMail.send(msg);

  return {
    statusCode: 200,
    body: `Please check your email`
  };
};
