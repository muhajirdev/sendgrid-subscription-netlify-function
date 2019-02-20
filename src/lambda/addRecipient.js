import client from "@sendgrid/client";
import Cryptr from "cryptr";

const cryptr = new Cryptr("secret");

const { SENDGRID_APIKEY } = process.env;
client.setApiKey(SENDGRID_APIKEY);

exports.handler = async (event, context) => {
  // const input = cryptr.encrypt(JSON.stringify(data));
  const input = event.queryStringParameters.id;
  if (!input) {
    return {
      statusCode: 404,
      body: "param id not found"
    };
  }
  const data = JSON.parse(cryptr.decrypt(input));

  const request = {};
  request.body = [data];
  request.method = "POST";
  request.url = "/v3/contactdb/recipients";
  const [_, body] = await client.request(request);

  return {
    statusCode: 200,
    body: `Assigned ${data.email} as subscriber`
  };
};
