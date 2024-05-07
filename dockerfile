version: '3.8'

services:

  postgres:
    image: postgres:latest
    environment:
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
      POSTGRES_DB: blockvoltdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # backend:
  #   build:
  #     context: .
  #     dockerfile: Dockerfile
  #   ports:
  #     - "3001:3001"
  #   environment:
  #     NODE_ENV: development
  #     PGHOST: postgres
  #     PGUSER: test
  #     PGPASSWORD: test
  #     PGDATABASE: walletdb
  #   depends_on:
  #     - postgres
  #   links:
  #     - postgres

volumes:
  postgres_data: