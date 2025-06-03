## Setup Instructions

1.  **Clone and install dependencies:**

    bash

    ```bash
    git clone <repository>
    cd stack-calculator-api
    npm install
    ```

2.  **Database setup:**

    bash

    ```bash
    cp .env.example .env
    # Edit .env with your database URL
    npx prisma migrate dev
    npx prisma generate
    ```

3.  **Development:**

    bash

    ```bash
    npm run dev
    ```

4.  **Docker deployment:**

    bash

    ```bash
    docker-compose up --build
    ```

## API Usage Examples

bash

```bash
# Get stack
curl -X GET http://localhost:3000/api/stack

# Add number
curl -X POST http://localhost:3000/api/stack/put/5

# Pop number
curl -X POST http://localhost:3000/api/stack/pop

# Perform operations
curl -X POST http://localhost:3000/api/stack/add
curl -X POST http://localhost:3000/api/stack/sub
curl -X POST http://localhost:3000/api/stack/mul
curl -X POST http://localhost:3000/api/stack/div
```
