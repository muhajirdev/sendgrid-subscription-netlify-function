import client from "@sendgrid/client";
import Cryptr from "cryptr";

const cryptr = new Cryptr("secret");

const { SENDGRID_APIKEY } = process.env;
client.setApiKey(SENDGRID_APIKEY);

const request = {
  method: "POST",
  url: "/v3/api_keys",
  body: [
    {
      age: 25,
      email: "example@example.com",
      first_name: "A",
      last_name: "B"
    }
  ]
};

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

  request.body = [data];
  request.method = "POST";
  request.url = "/v3/contactdb/recipients";
  const [_, body] = await client.request(request);

  return {
    statusCode: 200,
    body: `Assigned ${data.email} as subscriber`
  };
};
