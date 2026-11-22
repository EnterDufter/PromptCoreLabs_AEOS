FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    CODEGRAPH_PORT=20150 \
    ONNXRUNTIME_EXECUTION_PROVIDERS=CPUExecutionProvider

WORKDIR /app

RUN groupadd -g 10001 codegraph && \
    useradd -u 10001 -g codegraph -m -s /bin/sh codegraph

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY src /app/src
COPY graphs /app/graphs

RUN chown -R codegraph:codegraph /app

USER codegraph

EXPOSE 20150

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD python -c "import urllib.request, sys; r = urllib.request.urlopen('http://127.0.0.1:20150/ready', timeout=3); sys.exit(0 if r.status == 200 else 1)"

CMD ["python", "-m", "uvicorn", "src.http_server:app", "--host", "0.0.0.0", "--port", "20150"]
