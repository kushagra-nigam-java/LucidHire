#!/bin/bash
set -e

echo "======================================"
echo "🚀 LucidHire Production Deployment"
echo "======================================"

# 1. Install Docker & Docker Compose if missing
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installed."
else
    echo "✅ Docker is already installed."
fi

# 2. Ask for Domain
read -p "🌐 Enter your production domain or IP address (e.g., app.example.com or 123.45.67.89): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
    echo "⚠️ No domain provided. Defaulting to localhost."
    DOMAIN_NAME="localhost"
fi

# 3. Setup Production .env
ENV_FILE=".env.prod"
if [ ! -f "$ENV_FILE" ]; then
    echo "🔐 Generating secure production $ENV_FILE..."
    
    # Generate secure random passwords
    PG_PASS=$(openssl rand -hex 16)
    REDIS_PASS=$(openssl rand -hex 16)
    
    cat <<EOF > $ENV_FILE
DOMAIN=$DOMAIN_NAME
POSTGRES_USER=lucid_admin
POSTGRES_PASSWORD=$PG_PASS
REDIS_PASSWORD=$REDIS_PASS
DEMO_MODE=true
# Add your real API keys below later if DEMO_MODE=false:
GROQ_API_KEY=
GOOGLE_CALENDAR_CREDENTIALS=
GMAIL_SMTP_USER=
GMAIL_SMTP_PASSWORD=
EOF
    echo "✅ Production $ENV_FILE generated."
else
    echo "✅ $ENV_FILE already exists. Skipping generation."
fi

# 4. Ensure docker-compose.prod.yml and Caddyfile exist
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found! Aborting."
    exit 1
fi

if [ ! -f "Caddyfile" ]; then
    echo "❌ Error: Caddyfile not found! Aborting."
    exit 1
fi

# 5. Build and deploy
echo "🏗️ Building and starting containers..."
docker compose -f docker-compose.prod.yml --env-file $ENV_FILE up -d --build

echo "======================================"
echo "🎉 Deployment successful!"
echo "🌍 Access your application at: http(s)://$DOMAIN_NAME"
echo "======================================"
