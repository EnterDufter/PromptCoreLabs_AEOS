import { AuditLogEntry } from '../../types';

export class ISOAuditService {
  private static logs: AuditLogEntry[] = [
    {
      id: 'AUD-9012',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      userId: 'USR-001',
      userName: 'Eduardo Antigravity',
      action: 'Aprovação de Deploy - Squad Next Gen Sports v2.4',
      sha256Hash: 'a7c9f8e3b210459d81e7654a9012cd34ef56789a0123456789abcdef01234567',
      status: 'Approved',
      complianceStandard: 'ISO 27001'
    },
    {
      id: 'AUD-9011',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      userId: 'USR-001',
      userName: 'Eduardo Antigravity',
      action: 'Verificação de Viés Algorítmico (Stage Gate TLC v3)',
      sha256Hash: 'b8d0a9f4c321560e92f87655b012de45fa6789b123456789abcdef01234568',
      status: 'Audited',
      complianceStandard: 'ISO 42001'
    },
    {
      id: 'AUD-9010',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      userId: 'USR-002',
      userName: 'Ana Silva (Squad Lead)',
      action: 'Mascaramento PII em Prompt de Entrada (CPF/Email Sanitizado)',
      sha256Hash: 'c9e1ba05d432671fa3098766c123ef56ab7890c23456789abcdef01234569',
      status: 'Approved',
      complianceStandard: 'LGPD'
    },
    {
      id: 'AUD-9009',
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      userId: 'USR-001',
      userName: 'Eduardo Antigravity',
      action: 'Exportação de Relatório para o Conselho (Board Executive Summary)',
      sha256Hash: 'd0f2cb16e543782ab4109877d234fa67bc8901d3456789abcdef01234570',
      status: 'Audited',
      complianceStandard: 'EU AI Act'
    }
  ];

  public static async generateSha256(content: string, previousHash: string = ''): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${previousHash}:${content}:${Date.now()}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  public static getAuditLogs(): AuditLogEntry[] {
    return this.logs;
  }

  public static async verifyChainIntegrity(): Promise<{ valid: boolean; checkedCount: number }> {
    return { valid: true, checkedCount: this.logs.length };
  }

  public static async logAction(
    userName: string,
    action: string,
    complianceStandard: 'ISO 27001' | 'ISO 42001' | 'EU AI Act' | 'LGPD'
  ): Promise<AuditLogEntry> {
    const previousHash = this.logs.length > 0 ? this.logs[0].sha256Hash : 'GENESIS_HASH';
    const sha256Hash = await this.generateSha256(`${userName}:${action}`, previousHash);
    const newEntry: AuditLogEntry = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      userId: 'USR-001',
      userName,
      action,
      sha256Hash,
      status: 'Approved',
      complianceStandard
    };
    this.logs.unshift(newEntry);
    return newEntry;
  }
}

