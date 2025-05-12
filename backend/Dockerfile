FROM node:18-alpine

WORKDIR /app

# Kopiera endast package-filer först för att optimera cache
COPY package*.json ./

# Installera endast produktionsberoenden
RUN npm install --only=production

# Kopiera resten av applikationen
COPY . .

# Exponera backend-porten
EXPOSE 3001

# Lägg till en hälsokontroll
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001 || exit 1

# Starta backend
CMD ["npm", "start"]