# LucidHire Production Deployment Guide

Follow these 3 simple steps to deploy LucidHire to a live Ubuntu VPS (like DigitalOcean, AWS EC2, or Linode).

### Step 1: Prepare Your VPS
Connect to your VPS via SSH from your local machine:
```bash
ssh user@your-server-ip
```

### Step 2: Transfer the Repository
Once on the server, clone the repository or copy your files over:
```bash
git clone <your-repository-url> lucidhire
cd lucidhire
```
*(Note: If you haven't pushed to Git, you can securely copy your local project directory directly to the server using `rsync` or `scp`).*

### Step 3: Run the Deployment Script
Make the deployment script executable and run it:
```bash
chmod +x deploy.sh
./deploy.sh
```

### 💡 What the script does automatically:
1. **Installs Docker:** Checks if Docker is installed on the Ubuntu host and installs it if missing.
2. **Prompts for Domain:** Asks for your IP or Domain. If you provide a valid domain (e.g., `app.lucidhire.com`), the Caddy proxy will automatically provision **Let's Encrypt SSL** for secure HTTPS.
3. **Hardens Secrets:** Generates a `.env.prod` file with strongly randomized `POSTGRES_PASSWORD` and `REDIS_PASSWORD` hashes.
4. **Builds & Deploys:** Uses `docker-compose.prod.yml` to build the images and run the full stack in detached mode (`-d`). It seamlessly maps the Docker socket required for the Sandbox Orchestration.

---

### Managing the Live Deployment

- **View Live Logs:**
  ```bash
  docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f
  ```
- **Stop the Server:**
  ```bash
  docker compose -f docker-compose.prod.yml --env-file .env.prod down
  ```
- **Go Fully Live (Disable DEMO_MODE):** 
  Edit the `.env.prod` file (`nano .env.prod`), set `DEMO_MODE=false`, add your `GROQ_API_KEY`, and then run `./deploy.sh` again to apply the changes.
