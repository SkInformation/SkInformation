# SkInformation
![license](https://img.shields.io/badge/license-MIT-green)
![dotnet version](https://img.shields.io/badge/dotnet-v7.0-blue)
![nextjs version](https://img.shields.io/badge/nextjs-v14.0.3-purple)

SkInformation is a web app to help improve your skincare health and achieve your goals. Simply fill-out a short survey and get a customized report.

### Features
- [x] Supports various skin types (dry, oily, combination, normal)
- [x] Supports various skin goals (e.g., reduce redness, pore appearance, skin tone, etc.)
- [x] Search for products currently used
- [x] Add new products if they do not exist
- [x] Generate a report detailing recommended products and potential irritating ingredients
- [x] Optionally email the user the report to view at a later time

## Application Frontend
![SkInformation website](assets/app_frontend.png)

## Application Backend
![SkInformation website](assets/app_backend.png)

## How to Run

### Pre-requesites:
1. Install [Docker](https://docs.docker.com/get-docker/)
2. `cd` to the root directory of this repository.

### Define secrets for Docker Compose
Create the secrets folder
```bash
mkdir secrets
```

Create the [secret file](https://docs.docker.com/compose/use-secrets/)
```bash
echo "MySecretDbPassword" > secrets/sa_password.txt
echo "MyApiKey" > secrets/postmark_api_key.txt
echo "MyApiKey" > secrets/chatgpt_api_key.txt
```

### Build & Run
Build the multi-container app using
```bash
docker compose build
```

Start the multi-container app using
```bash
docker compose up
```

Navigate to `http://localhost:3000` in your browser.

### Useful commands
Stop the multi-container app using
```bash
docker compose down
```
