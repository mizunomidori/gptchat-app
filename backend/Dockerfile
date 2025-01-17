# syntax=docker/dockerfile:1

# https://v2.ja.vuejs.org/v2/cookbook/dockerize-vuejs-app
FROM python:3.12-slim AS base

ARG LANG C.UTF-8
ARG TZ Asia/Tokyo

RUN apt -y update && \
    apt install -y curl build-essential git && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /app

COPY pyproject.toml* poetry.lock* /app/

RUN poetry config virtualenvs.create false && \
    poetry install --no-root

COPY . /app/

EXPOSE 8000

ENTRYPOINT ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
