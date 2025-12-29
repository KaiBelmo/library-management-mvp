FROM node:22-alpine AS deps
WORKDIR /app

RUN corepack enable
# Only copy files needed for installing dependencies
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
# Remove devDependencies to keep the image small
RUN npm prune --production

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Use --chown to ensure the 'nextjs' user can read/execute the files
COPY --from=builder --chown=nextjs:nodejs /app/.output ./.output
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

# Nitro (Nuxt) standalone server entry point
CMD ["node", ".output/server/index.mjs"]