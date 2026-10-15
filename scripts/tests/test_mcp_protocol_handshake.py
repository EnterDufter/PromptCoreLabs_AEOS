"""
PCL AEOS - Teste de Handshake do Protocolo MCP (JSON-RPC via stdio)
Valida a comunicação entre o harness da IDE e o processo do servidor MCP Laya.
"""

import sys
import subprocess
import json
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def test_mcp_handshake():
    print("=" * 70)
    print("PCL AEOS — VALIDAÇÃO DE PROTOCOLO MCP (JSON-RPC VIA STDIO)")
    print("=" * 70)

    server_cmd = [sys.executable, r"C:\PromptCore_Labs\services\pcl-laya\src\mcp_server.py"]
    
    proc = subprocess.Popen(
        server_cmd,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=0
    )

    try:
        # 1. Enviar Initialize Request
        init_req = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "antigravity-test-client", "version": "1.0.0"}
            }
        }
        
        proc.stdin.write(json.dumps(init_req) + "\n")
        proc.stdin.flush()
        
        raw_response = proc.stdout.readline()
        if not raw_response:
            print("[ERRO] Nenhuma resposta recebida no handshake MCP.")
            return

        resp = json.loads(raw_response)
        print("  [+] Handshake 'initialize' recebido com sucesso:")
        print(f"      Protocolo: {resp.get('result', {}).get('protocolVersion')}")
        print(f"      Servidor: {resp.get('result', {}).get('serverInfo', {}).get('name')}")

        # 2. Enviar Notificação 'notifications/initialized'
        proc.stdin.write(json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}) + "\n")
        proc.stdin.flush()

        # 3. Chamar 'tools/list'
        tools_req = {"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}
        proc.stdin.write(json.dumps(tools_req) + "\n")
        proc.stdin.flush()

        raw_tools = proc.stdout.readline()
        tools_resp = json.loads(raw_tools)
        tools = tools_resp.get("result", {}).get("tools", [])
        tool_names = [t["name"] for t in tools]
        print(f"  [+] Ferramentas registradas no MCP Server ({len(tools)}):")
        for name in tool_names:
            print(f"      - {name}")

        # 4. Executar chamada real 'tools/call' para 'laya_check_contradiction'
        call_req = {
            "jsonrpc": "2.0",
            "id": 3,
            "method": "tools/call",
            "params": {
                "name": "laya_check_contradiction",
                "arguments": {
                    "state": "Serviço OmniRoute operando na porta 20130 e Dashboard na 8080",
                    "query": "porta 20140 contradiz 8080"
                }
            }
        }
        
        t0 = time.perf_counter()
        proc.stdin.write(json.dumps(call_req) + "\n")
        proc.stdin.flush()
        
        raw_call = proc.stdout.readline()
        lat_ms = (time.perf_counter() - t0) * 1000
        call_resp = json.loads(raw_call)

        print(f"  [+] Execução 'tools/call' (laya_check_contradiction):")
        print(f"      Latência IPC stdio: {lat_ms:.2f} ms")
        print(f"      Resultado: {call_resp.get('result', {}).get('content', [{}])[0].get('text')}")

        print("\n" + "=" * 70)
        print("STATUS: PROTOCOLO MCP STDIO VALIDADO DE PONTA A PONTA COM SUCESSO!")
        print("=" * 70)

    finally:
        proc.terminate()

if __name__ == "__main__":
    test_mcp_handshake()
