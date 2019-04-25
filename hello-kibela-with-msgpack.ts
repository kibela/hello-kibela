import util from "util";
import "dotenv/config"; // to load .env
import fetch from "node-fetch";
import msgpack from "msgpack-lite";
import { name, version } from "./package.json";

const TEAM = process.env.KIBELA_TEAM;
const TOKEN = process.env.KIBELA_TOKEN;
const API_ENDPOINT = `https://${TEAM}.kibe.la/api/v1`;
const USER_AGENT = `${name}/${version}`;

const query = `
query HelloKibela {
  currentUser {
    account
  }
}
`;

const variables = {};

async function parseBody(response: any): Promise<object> {
  if (response.headers.get('Content-Type').includes("msgpack")) {
    const body = await response.buffer();
    return msgpack.decode(body);
  } else {
  // the endpoint may return JSON even if `accept: application/x-msgpack` is set.
    const body = await response.text();
    return JSON.parse(body);
  }
}

(async () => {
  const response = await fetch(API_ENDPOINT,
    {
      method: "POST", // [required]
      redirect: "follow",
      headers: {
        "Authorization": `Bearer ${TOKEN}`, // [required]
        "Content-Type": "application/x-msgpack", // [required]
        // `application/json` is required as a secondary type
        "Accept": "application/x-msgpack, application/json", // [required]
        "User-Agent": USER_AGENT, // [recommended]
      },
      body: msgpack.encode({ query, variables }),
    });

  if (!response.ok) {
    const bodyData = await parseBody(response);
    console.error(
      `${response.status} ${response.statusText}:\n${util.inspect(bodyData, undefined, 10)}`);
    return;
  }

  const bodyData = await parseBody(response);
  console.log("Content-Type", response.headers.get("content-type"));
  console.log(bodyData);
})();
