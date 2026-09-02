# Guia Técnico de Otimização de VRAM & Ciclo de Vida Reativo (PCL AEOS)

**Host Target**: Lenovo LOQ 15IAX9  
**Especificações do Host**:
* **CPU**: Intel Core i5-12450HX (8 núcleos / 12 threads)
* **RAM**: 16 GB DDR5 4800MHz
* **GPU**: NVIDIA GeForce RTX 3050 Laptop (6 GB VRAM GDDR6 Dedicada)
* **Armazenamento SSD**: ~78 GB livres
* **OS**: Windows 11 64-bit + Docker Desktop (WSL2 Engine)

---

## 1. Princípio Arquitetural: Alocação Reativa Sob Demanda (Trigger-Based)

Diferente de abordagens tradicionais que mantêm modelos pesados constantemente alocados na GPU (consumindo recursos do sistema durante a navegação/trabalho convencional), o **PCL AEOS** adota um **Ciclo de Vida Reativo baseado em Gatilhos de Estado**:

```
+-----------------------------------------------------------------------------------+
|                              ESTADO NORMAL (ONLINE)                               |
|                                                                                   |
|  * Requisicoes via OmniRoute -> Cloud APIs (OpenRouter / Ollama Cloud API)         |
|  * VRAM Dedicada RTX 3050 = 0 MB (100% Livre para o Usuario)                      |
|  * System RAM DDR5 = 0 MB de modelo alocado                                       |
+-----------------------------------------------------------------------------------+
                                          |
                         [Queda de Conexao com Internet / VPN]
                                          v
+-----------------------------------------------------------------------------------+
|                             GATILHO OFFLINE (TRIGGER)                             |
|                                                                                   |
|  1. Daemon 'watch_network_trigger.ps1' detecta falha no ping/conexao              |
|  2. Executa 'on_offline_event.ps1'                                                |
|  3. Comando 'lms load qwen2.5-coder-7b-instruct --gpu max --ttl 1800'             |
|  4. VRAM alocada sob demanda (~5.3 GB) APENAS durante o periodo Offline           |
+-----------------------------------------------------------------------------------+
                                          |
                        [Restabelecimento da Internet / VPN]
                                          v
+-----------------------------------------------------------------------------------+
|                             GATILHO ONLINE (RESTORATION)                          |
|                                                                                   |
|  1. Daemon detecta o retorno da conectividade                                     |
|  2. Executa 'on_online_event.ps1'                                                 |
|  3. Comando 'lms unload --all' descarrega o modelo da VRAM                        |
|  4. VRAM retorna instantaneamente para 0 MB                                       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Dimensionamento de VRAM quando acionado no modo Offline

Quando o gatilho offline é disparado, os parâmetros abaixo garantem estabilidade total sem estouro de VRAM na RTX 3050 (6 GB):

### `Qwen2.5-Coder-7B-Instruct (Q4_K_M)`

* **Tamanho do Peso**: ~4.7 GB (Quantização `Q4_K_M`)
* **Camadas Offloaded para GPU**: 100% (31/31 layers)
* **Context Window Ideal**: **8192 tokens** (~640 MB KV Cache fp16)
* **Consumo Total VRAM**: ~5.34 GB / 6.00 GB (🟢 100% Seguro)

---

## 3. Scripts de Controle de Estado

Os scripts em `scripts/windows/` governam a transição:

1. **`watch_network_trigger.ps1`**: Monitor de conectividade em tempo real.
2. **`on_offline_event.ps1`**: Carrega o modelo local na GPU sob demanda.
3. **`on_online_event.ps1`**: Descarrega o modelo e libera 100% da VRAM.
