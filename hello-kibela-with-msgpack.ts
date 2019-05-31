import "core-js"; // for nodejs v10
import util from "util";
import "dotenv/config"; // to load .env
import nodeFetch from "node-fetch";
import * as msgpack from "@msgpack/msgpack";
import gql from "graphql-tag";
import { print as printGql } from "graphql/language/printer"

import { name, version } from "./package.json";

const TEAM = process.env.KIBELA_TEAM;
const TOKEN = process.env.KIBELA_TOKEN;
const API_ENDPOINT = `https://${TEAM}.kibe.la/api/v1`;
const USER_AGENT = `${name}/${version}`;

globalThis.fetch = nodeFetch; // polyfill

// `gql` is optional but it tells IDEs that it is GraphQL
const query = gql`
query HelloKibela {
  currentUser {
    account
  }

  notes(first: 10, orderBy: {field: CONTENT_UPDATED_AT, direction: DESC}) {
    edges {
      node {
        title
      }
    }
  }
}
`;


async function parseBody(response: Response): Promise<object> {
  if (response.headers.get("Content-Type")!.includes("msgpack")) {
    // Use async decoder for response.body
    const object = await msgpack.decodeAsync(response.body!);
    return object as object;

    // Syncronous version of decode() is also available:
    // const body = await response.buffer();
    // return msgpack.decode(body) as object;
  } else {
    // the endpoint may return JSON even if `accept: application/x-msgpack` is set.
    const body = await response.text();
    return JSON.parse(body);
  }
}

(async () => {
  const response = await fetch(API_ENDPOINT, {
    method: "POST", // [required]
    mode: "cors",
    redirect: "follow",
    headers: {
      Authorization: `Bearer ${TOKEN}`, // [required]
      "Content-Type": "application/x-msgpack", // [required]
      // `application/json` is required as a secondary type
      Accept: "application/x-msgpack, application/json", // [required]
      "User-Agent": USER_AGENT // [recommended]
    },
    body: msgpack.encode({
      query: printGql(query),
      variables: {},
    })
  });

  if (!response.ok) {
    const bodyData = await parseBody(response);
    console.error(
      `${response.status} ${response.statusText}:\n${util.inspect(
        bodyData,
        undefined,
        10
      )}`
    );
    return;
  }

  const bodyData = await parseBody(response);
  console.log("Content-Type", response.headers.get("content-type"));
  console.dir(bodyData, { depth: 100 });
})();
