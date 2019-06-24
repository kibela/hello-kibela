import "dotenv/config"; // to load .env
import fetch from "node-fetch";
import gql from "graphql-tag";
import { print as printGql } from "graphql/language/printer";

import { name, version } from "./package.json";

const TEAM = process.env.KIBELA_TEAM;
const TOKEN = process.env.KIBELA_TOKEN;
const API_ENDPOINT = `https://${TEAM}.kibe.la/api/v1`;
const USER_AGENT = `${name}/${version}`;

// `gql` is optional but it tells IDEs that it is GraphQL
const query = gql`
  query HelloKibela {
    currentUser {
      account
    }

    notes(first: 10, orderBy: { field: CONTENT_UPDATED_AT, direction: DESC }) {
      edges {
        node {
          title
          publishedAt
        }
      }
    }
  }
`;

(async () => {
  const response = await fetch(API_ENDPOINT, {
    method: "POST", // [required]
    redirect: "follow",
    mode: "cors",
    headers: {
      Authorization: `Bearer ${TOKEN}`, // [required]
      "Content-Type": "application/json", // [required]
      Accept: "application/json", // [required]
      "User-Agent": USER_AGENT // [recommended]
    },
    body: JSON.stringify({
      query: printGql(query),
      variables: {}
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`not ok: ${response.statusText}\n${body}`);
  }

  const body = await response.json();

  console.log("Content-Type", response.headers.get("content-type"));
  console.dir(body, { depth: 100 });
})();
