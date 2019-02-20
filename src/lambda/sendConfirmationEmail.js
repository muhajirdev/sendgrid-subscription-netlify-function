import client from "@sendgrid/client";
import Cryptr from "cryptr";

const cryptr = new Cryptr("secret");
const url = process.env.URL || "http://localhost:9000";
const addRecipientUrl = `${url}/addRecipient`;
const getAddRecipientUrl = id => `${addRecipientUrl}?id=${id}`;

const { SENDGRID_APIKEY } = process.env;
client.setApiKey(SENDGRID_APIKEY);

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
    template_id: "d-90a1e1c2111542229b30c31c13575635",
    personalizations: [
      {
        dynamic_template_data: {
          first_name: data.first_name,
          url: getAddRecipientUrl(id)
        },
        to: [
          {
            email: data.email,
            name: `${data.first_name} ${data.last_name}`
          }
        ]
      }
    ],
    from: {
      email: "no-reply@muhajirframe.com",
      name: "Muhammad Muhajir"
    }
  };

  const request = {};
  request.body = msg;
  request.method = "POST";
  request.url = "/v3/mail/send";
  await client.request(request);

  return {
    statusCode: 200,
    body: `Please check your email`
  };
};
