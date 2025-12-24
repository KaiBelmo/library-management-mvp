FROM directus/directus:latest

USER root
RUN corepack enable && corepack prepare pnpm@latest --activate

USER node
RUN pnpm install directus-extension-sync
