FROM oven/bun:1.4.2 as base
WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

COPY src ./src
COPY tsconfig.json ./

RUN bun src/db/migrate.ts || echo "migrate will run at startup"

EXPOSE 3000
CMD ["bun", "src/index.ts"]
