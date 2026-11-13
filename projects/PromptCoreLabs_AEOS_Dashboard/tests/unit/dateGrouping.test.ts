import { describe, it, expect } from 'vitest';
import {
  getConversationDateGroup,
  formatMessageTimestamp,
  calibrateConversationChronology
} from '../../src/utils/dateGrouping';
import { Conversation, Project } from '../../src/types';

function makeConv(id: string, daysAgo: number, extra: Partial<Conversation> = {}): Conversation {
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0).getTime();
  const target = new Date(base - daysAgo * 24 * 60 * 60 * 1000);
  return {
    id,
    title: `Conv ${id}`,
    projectId: 'proj-test',
    updatedAt: target.toISOString(),
    messages: [],
    artifacts: [],
    ...extra
  };
}

describe('dateGrouping utilities', () => {
  it('classifica corretamente Hoje, Ontem, Últimos 7 dias, Últimos 15 dias e Últimos 30 dias', () => {
    expect(getConversationDateGroup(makeConv('c-today', 0))).toBe('Hoje');
    expect(getConversationDateGroup(makeConv('c-yesterday', 1))).toBe('Ontem');
    expect(getConversationDateGroup(makeConv('c-4d', 4))).toBe('Últimos 7 dias');
    expect(getConversationDateGroup(makeConv('c-10d', 10))).toBe('Últimos 15 dias');
    expect(getConversationDateGroup(makeConv('c-22d', 22))).toBe('Últimos 30 dias');
  });

  it('usa fallback para createdAt da última mensagem e timestamp embutido no ID', () => {
    const now = new Date();
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 15, 30, 0);

    const byMessage: Conversation = {
      id: 'c-msg-fallback',
      title: 'By Msg',
      projectId: 'p1',
      updatedAt: '',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          senderName: 'Operador',
          timestamp: '15:30',
          createdAt: yesterday.toISOString(),
          text: 'Olá'
        }
      ],
      artifacts: []
    };
    expect(getConversationDateGroup(byMessage)).toBe('Ontem');

    const fiveDaysAgoEpoch = now.getTime() - 5 * 24 * 60 * 60 * 1000;
    const byId: Conversation = {
      id: `conv-${fiveDaysAgoEpoch}`,
      title: 'By ID',
      projectId: 'p1',
      updatedAt: '',
      messages: [],
      artifacts: []
    };
    expect(getConversationDateGroup(byId)).toBe('Últimos 7 dias');
  });

  it('formata timestamps de mensagens distinguindo hoje, ontem e dias anteriores', () => {
    const now = new Date();
    const todayIso = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 25, 0).toISOString();
    const yesterdayIso = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 10, 5, 0).toISOString();
    const olderIso = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 4, 9, 12, 0).toISOString();

    expect(formatMessageTimestamp({ createdAt: todayIso })).not.toContain('Ontem');
    expect(formatMessageTimestamp({ createdAt: yesterdayIso })).toMatch(/^Ontem,\s/);
    expect(formatMessageTimestamp({ createdAt: olderIso })).toMatch(/^\d{2}\/\d{2},\s/);
  });

  it('calibra cronologia apenas quando >= 4 conversas colapsam artificialmente em Hoje', () => {
    const todayConvs = Array.from({ length: 8 }, (_, idx) => makeConv(`c-${idx}`, 0));
    const projects: Project[] = [
      { id: 'p1', name: 'P1', conversationsCount: 8, activeAgentsCount: 1, conversations: todayConvs }
    ];

    const calibrated = calibrateConversationChronology(projects);
    const groups = new Set(calibrated[0].conversations.map(c => getConversationDateGroup(c)));
    expect(groups.has('Hoje')).toBe(true);
    expect(groups.has('Ontem')).toBe(true);
    expect(groups.has('Últimos 7 dias')).toBe(true);
  });
});

