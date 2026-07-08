import json
import random
import statistics

def simulate_telemetry_laps(num_laps=10):
    """Simula o desvio de traçado em segundos para X voltas."""
    print(f"--- Iniciando Simulação de Telemetria (Digital Twin) para {num_laps} voltas ---")
    # Simula desvios entre 0.1s e 1.0s
    laps = [round(random.uniform(0.1, 0.9), 3) for _ in range(num_laps)]
    for i, deviation in enumerate(laps, 1):
        print(f"Volta {i}: Desvio = {deviation}s")
    return laps

def validate_badge_consistencia(laps_data, threshold=0.5):
    """Valida se o piloto atingiu a média necessária para o badge."""
    avg_deviation = round(statistics.mean(laps_data), 3)
    print(f"\n--- Resultado da Análise ---")
    print(f"Média de Desvio: {avg_deviation}s")
    print(f"Threshold Necessário: <= {threshold}s")
    
    if avg_deviation <= threshold:
        print("\n✅ STATUS: APROVADO!")
        print("🏆 BADGE CONQUISTADO: 'Piloto Consistente'")
        return True
    else:
        print("\n❌ STATUS: REPROVADO")
        print("💡 DICA: Mantenha o traçado mais firme nas curvas de baixa para reduzir o desvio médio.")
        return False

import os

# Caminho absoluto para o JSON (mesma pasta do script)
script_dir = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(script_dir, 'skill_tree.json')

# Carregar estrutura da Skill Tree
try:
    with open(json_path, 'r', encoding='utf-8') as f:
        skill_data = json.load(f)
        # Busca o nível de consistência no JSON
        target_level = skill_data['skill_tree']['categories'][0]['levels'][1]
        threshold = target_level['validation']['threshold']
        badge_name = target_level['badge']
except Exception as e:
    print(f"Erro ao carregar JSON: {e}")
    threshold = 0.5
    badge_name = "Piloto Consistente"

def display_revops_insights(is_approved, is_premium, is_lms_member):
    """Exibe CTAs e recomendações educacionais baseadas no resultado."""
    print(f"\n--- NextGen Sports Business Intelligence ---")
    
    if not is_premium:
        print("💡 [OPORTUNIDADE] Quer ver sua telemetria volta a volta com análise de IA?")
        print("👉 Torne-se PREMIUM e acelere sua profissionalização: https://nextgen.sports/premium")
    
    if not is_approved and is_lms_member:
        print("\n📚 [DICA DO COACH] Detectamos uma instabilidade no seu traçado.")
        print("🎯 Recomendamos reforçar o curso: 'Módulo II - Geometria de Curva e Pontos de Tangência'")
        print("🔗 Acesse sua trilha no LMS: https://lms.nextgen.sports/curso/geometria-curva")
    elif is_approved and is_lms_member:
        print("\n🌟 [PRÓXIMO PASSO] Você dominou a consistência!")
        print("🚀 Que tal iniciar o desafio: 'Técnicas Avançadas de Trail-Braking'?")

# --- Configurações de Perfil do Usuário (Para o Teste) ---
USER_IS_PREMIUM = False
USER_IS_LMS_MEMBER = True

# Executar simulação
telemetry = simulate_telemetry_laps(10)
approved = validate_badge_consistencia(telemetry, threshold)

# Exibir Camada RevOps / Educacional
display_revops_insights(approved, USER_IS_PREMIUM, USER_IS_LMS_MEMBER)
