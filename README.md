# Frontend

## Requirements
- Docker
- Buildout API token

### Optional
- Docker Hub API token

## Setup
```
chmod +x run.sh
cp .env.example .env
```
Fill out the `.env` file accordingly

## Development
Run with hot reload:

```
./run.sh run_dev
```
Visit: `http://localhost:8080`

## Build (Local Production Test)
After making changes, build locally to ensure it succeeds:

```
./run.sh run_prod_build_local
```
Visit: `http://localhost:80`

## Production
Using Docker Hub image:

```
./run.sh fetch_latest_image
./run.sh run_prod
```

Or build locally and run:

```
./run.sh run_prod_build_local
```

Visit: `http://localhost:80`


