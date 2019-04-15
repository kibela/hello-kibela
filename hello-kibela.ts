import "dotenv/config"; // to load .env
import fetch from "node-fetch";
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

(async () => {
  const response = await fetch(API_ENDPOINT,
    {
      method: "POST", // [required]
      redirect: "follow",
      headers: {
        "Authorization": `Bearer ${TOKEN}`, // [required]
        "Content-Type": "application/json", // [required]
        "Accept": "application/json", // [required]
        "User-Agent": USER_AGENT, // [recommended]
      },
      body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `not ok: ${response.statusText}\n${body}`)
  }

  const body = await response.json();

  console.log(body);
})();
