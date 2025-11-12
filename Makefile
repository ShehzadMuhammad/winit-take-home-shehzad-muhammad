# Makefile for Winit Take-Home API

# Build the Docker image (no cache)
build:
	docker compose build --no-cache

# Start container (mock mode by default)
up:
	docker compose up --build

# Stop and remove container
down:
	docker compose down

# View logs (follow mode)
logs:
	docker compose logs -f winit-takehome-app

# Run in mock mode (default fixtures)
run_mock:
	MODE=mock docker compose up --build

# Run in live mode (real scraping)
run_live:
	MODE=live docker compose up --build

# Stop and remove containers, volumes, and orphans
clean:
	docker compose down -v --remove-orphans
	docker system prune -f
