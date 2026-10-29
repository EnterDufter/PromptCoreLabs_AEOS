FROM python:3.11-slim

# Metadados de Governança PCL AEOS
LABEL maintainer="PromptCore Labs <architecture@promptcore.com.br>"
LABEL governance="PCL-AEOS-NORM-01 (Principles-Aligned)"
LABEL service="pcl-laya"
LABEL device="CPUExecutionProvider"
LABEL model="cross-encoder/nli-MiniLM2-L6-H768"
LABEL commit="b95119ce93d3e065de6214e38cd4a97b0f2f2c6d"

WORKDIR /app

# Variáveis de Ambiente Mandatórias (Proteção de VRAM e Performance CPU)
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    ONNXRUNTIME_EXECUTION_PROVIDERS=CPUExecutionProvider \
    LAYA_MODEL_DIR=/app/models/nli-minilm \
    LAYA_CPU_THREADS=2 \
    PORT=20140

# Instalação de dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Criação de usuário seguro desprivilegiado (Zero Trust / Non-Root)
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/sh -m appuser

# Cópia de scripts e modelos com garantia de modelo neural pré-carregado
COPY scripts/ ./scripts/
COPY models/ ./models/
RUN python scripts/download_model.py

# Cópia do código-fonte
COPY src/ ./src/
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 20140

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:20140/ready')" || exit 1

CMD ["python", "src/main.py"]
