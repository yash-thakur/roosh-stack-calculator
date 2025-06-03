## Setup Instructions

1.  **Clone and install dependencies:**

    ```bash
    git clone <repository>
    cd roosh-stack-calculator
    npm install
    ```

2.  **Database setup:**

    ```bash
    cp .env.example .env
    # Edit .env with your database URL
    ```

3.  **Docker deployment:**

    ```bash
    docker-compose up --build
    ```

    perform initial migration in new terminal

    ```bash
    npx prisma migrate dev
    ```

4.  **Testing:**

    ```bash
    npm test
    ```

## API Usage Examples

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
