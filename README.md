# NodeJS Auth with JWT Refresh Token

This is just a simple exploration exercise on how to properly implement a Auth system in NodeJS using JWT with a refresh token strategy. The idea is to keep the JWT token expiration date short and use a refresh token with a longer TTL to refresh the JWT access token.

I've used TypeScript (why not...) and TypeORM.

## Setup
    $ yarn install

or

    $ npm install

## External Dependencies

- Redis

In order to keep track of the emitted refresh tokens we save those as key-value items in a in-memory store backed by [Redis](https://redis.io/).
