FROM node:18-alpine

# Sätt arbetskatalogen
WORKDIR /app

# Kopiera endast package-filer först för att optimera cache
COPY package.json package-lock.json ./

# Installera alla beroenden (inklusive devDependencies)
RUN npm install --legacy-peer-deps

# Kopiera resten av applikationen
COPY . .

# Bygg Next.js-applikationen
RUN npm run build

# Exponera porten som applikationen körs på
EXPOSE 3000

# Starta applikationen
CMD ["npx", "next", "start"]