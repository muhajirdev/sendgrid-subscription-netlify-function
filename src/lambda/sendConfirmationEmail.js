const templates = require("transactional-email-templates");
import sgMail from "@sendgrid/mail";
import Cryptr from "cryptr";

const cryptr = new Cryptr("secret");
const url = process.env.URL || "http://localhost:9000";
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
  const html = templates.action({
    title: "Confirm your subscribtion",
    bodyElements: [
      "Please confirm your email address by clicking the link below.",
      "We may need to send you critical information about our service and it is important that we have an accurate email address."
    ],
    link: getAddRecipientUrl(id),
    linkCTA: "Confirm Email Address",
    linkColor: "#3A90D7",
    byline: "-- Syria Product",
    footerText: "Follow ",
    footerLink: "http://twitter.com/syriaproduct",
    footerLinkText: "@syriaproduct on Twitter"
  });

  const msg = {
    to: data.email,
    from: "no-reply@muhajirframe.com",
    subject: "Confirm your subscribtion",
    text: `Please confirm your email address by clicking the link below.${getAddRecipientUrl(
      id
    )}`,
    html
  };

  await sgMail.send(msg);

  return {
    statusCode: 200,
    body: `Please check your email`
  };
};
