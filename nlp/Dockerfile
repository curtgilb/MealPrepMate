# Build stage
FROM python:3.10-slim AS builder

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*


# Install Poetry
ENV POETRY_HOME="/opt/poetry"
ENV PATH="$POETRY_HOME/bin:$PATH"

RUN curl -sSL https://install.python-poetry.org | python3 - && \
    poetry --version

# Add the poetry-plugin-export
RUN poetry self add poetry-plugin-export

# Set working directory
WORKDIR /app

# Copy dependency files first to optimize caching
COPY pyproject.toml poetry.lock* ./

RUN poetry export --without-hashes --format=requirements.txt > requirements.txt

# Final stage
FROM python:3.10-alpine

RUN apk update && apk upgrade --no-cache

WORKDIR /app

ENV NLTK_DATA=/app/nltk_data

# Copy requirements.txt from builder stage
COPY --from=builder /app/requirements.txt /app

RUN pip install --no-cache-dir -r ./requirements.txt

# Set up a non-root user
RUN adduser -D -H appuser

# Ensure appuser owns NLTK data directory
RUN mkdir -p /app/nltk_data && chown -R appuser:appuser /app

# Swtich to appuser
USER appuser

# Copy application code
COPY --chown=appuser:appuser . .

CMD ["sh", "-c", "fastapi run main.py --port $NLP_PORT"]
