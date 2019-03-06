import client from "@sendgrid/client";
import Cryptr from "cryptr";

const cryptr = new Cryptr("secret");
const url = process.env.URL || "http://localhost:9000";
const addRecipientUrl = `${url}/addRecipient`;
const getAddRecipientUrl = id => `${addRecipientUrl}?id=${id}`;

const { SENDGRID_APIKEY, TEMPLATE_ID, SENDER_NAME, SENDER_EMAIL } = process.env;
client.setApiKey(SENDGRID_APIKEY);

exports.handler = async (event, context) => {

  // When the method is POST, the name will no longer be in the event’s
  // queryStringParameters – it’ll be in the event body encoded as a query string
  const data = JSON.parse(event.body);
  const id = cryptr.encrypt(JSON.stringify(data));

  const msg = {
    template_id: TEMPLATE_ID,
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
      email: SENDER_EMAIL,
      name: SENDER_NAME
    }
  };

  const request = {};
  request.body = msg;
  request.method = "POST";
  request.url = "/v3/mail/send";
  await client.request(request);

  return {
    statusCode: 200,
     headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS'
      'Access-Control-Max-Age': '2592000',
      'Access-Control-Allow-Credentials': 'true',
    },
    body: `Please check your email`
  };
};
