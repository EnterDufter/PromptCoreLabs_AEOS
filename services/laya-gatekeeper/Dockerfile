# PCL AEOS — Laya Security & FinOps Gatekeeper Sidecar (PROAA-15 & PROAA-16)
# Invariante Hardware: 100% CPUExecutionProvider (0 MB VRAM na GPU dedicada)
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    GATEKEEPER_PORT=20160 \
    LAYA_FORCE_CPU=1 \
    CUDA_VISIBLE_DEVICES=""

WORKDIR /app

RUN groupadd -r gatekeeper && useradd -r -g gatekeeper -s /sbin/nologin gatekeeper

COPY pyproject.toml /app/
RUN pip install --no-cache-dir fastapi uvicorn pydantic PyYAML httpx numpy onnxruntime tokenizers

COPY policies/ /app/policies/
COPY app/ /app/app/

RUN mkdir -p /app/logs && chown -R gatekeeper:gatekeeper /app

USER gatekeeper

EXPOSE 20160

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:20160/health')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "20160"]
