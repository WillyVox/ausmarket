# To get this exact PostgreSQL database running locally on your Mac using Docker, follow these step-by-step instructions

## 1 Install Docker Desktop
Setup
Open your terminal and run the following command using Homebrew:

```Bash
brew install --cask docker
```
(Alternatively, download the installer directly from the Docker Desktop for Mac website).

Once installed, launch Docker from your Applications folder to start the Docker daemon.

## 2 Run PostgreSQL Container
1 min
Execute this command in your terminal to download and spin up a PostgreSQL container matching your target credentials (username: postgres, password: postgres, port: 5432):

```Bash
docker run --name local-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  -d postgres:alpine
```
-v pgdata:... creates a Docker volume so your data persists even if the container stops.

-p 5432:5432 maps port 5432 from inside the container to your Mac's localhost.

## 3 Create the Database
Final step
Run the following command to execute createdb inside the running container and set up the ausmarket database:

```Bash
docker exec -it local-postgres createdb -U postgres ausmarket
```
Verification
To verify the database exists, run:
```Bash
docker exec -it local-postgres psql -U postgres -l
```

Look for ausmarket in the output list. Your connection string postgresql://postgres:postgres@localhost:5432/ausmarket is now ready to use in your local application!