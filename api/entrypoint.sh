
export NODE_ENV=documentation

npm run swagger-autogen

npm run start-dev

exec "$@"