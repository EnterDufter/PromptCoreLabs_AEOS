FROM python:3.11-slim

# Metadados de Governança PCL AEOS
LABEL maintainer="PromptCore Labs <architecture@promptcore.com.br>"
LABEL compliance="ISO/IEC 27001 & ISO/IEC 42001"
LABEL service="pcl-laya"
LABEL device="CPUExecutionProvider"

WORKDIR /app

# Variáveis de Ambiente Mandatórias (Proteção de VRAM e Performance CPU)
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    ONNXRUNTIME_EXECUTION_PROVIDERS=CPUExecutionProvider \
    PORT=20140

# Instalação de dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Criação de usuário seguro desprivilegiado (Zero Trust / Non-Root)
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/sh -m appuser

# Cópia do código-fonte
COPY src/ ./src/
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 20140

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:20140/health')" || exit 1

CMD ["python", "src/main.py"]
