FROM python:3.13-slim AS build
WORKDIR /app
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    build-essential \
    libatlas-base-dev \
    libpq-dev \
    && python3 -m venv /venv \
    && /venv/bin/pip install --disable-pip-version-check --upgrade pip setuptools wheel \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN /venv/bin/pip install --disable-pip-version-check --no-cache-dir --no-build-isolation -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu
COPY . .

FROM python:3.13-slim
COPY --from=build /venv /venv
COPY --from=build /app /app
WORKDIR /app
ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}
ENV PINECONE_API_KEY=${PINECONE_API_KEY}
ENV PINECONE_ENV=${PINECONE_ENV}
ENV PATH="/venv/bin:$PATH"
ENV PORT=${PORT:-8000}
EXPOSE ${PORT}
CMD ["/venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${PORT}"]