# Hello, Kibela Web API!

This is a set of sample scripts to call [Kibela](https://kibe.la/) Web API that includes:

* TypeScript on NodeJS using JSON
* TypeScript on NodeJS using MessagePack
* JavaScript on browsers using JSON (CORS)

## Prerequisites

NodeJS v10 or greater.

## Setup

```shell-session
# Install dependencies
npm install

# Configure KIBELA_TEAM and KIBELA_TOKEN
code .env

# Run a "hello" script using JSON
npx ts-node hello-kibela.ts

# Run a "hello" script using MessagePack
npx ts-node hello-kibela-with-msgpack.ts
```

## See Also

* https://github.com/kibela/kibela-api-v1-document

## License

This project is destributed under the ICS license.

See [LICENSE](./LICENSE) for details.
