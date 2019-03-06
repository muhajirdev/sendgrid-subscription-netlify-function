import client from "@sendgrid/client";
import Cryptr from "cryptr";

const cryptr = new Cryptr("secret");

const getHtmlRedirect = url => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="refresh" content="0; URL='${url}'" />

    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    Subscribed, you will be redirected. If not, please <a href="${url}">click here</a>
  </body>
</html>
`;

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
    headers: {  
        "Content-Type": "text/html",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
    body: getHtmlRedirect(process.env.URL)
  };
};
