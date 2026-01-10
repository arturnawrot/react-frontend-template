# Frontend

## Installation
```
chmod +x run.sh
```

### Development (with Hot Reloading)
```
./run.sh run_dev
```

### Production
```
./run.sh run_prod
```

### Applying Changes in Production
After making any changes to the codebase, you need to bring down the existing Docker containers and restart the production setup:

````
docker compose down
./run.sh run_prod
````