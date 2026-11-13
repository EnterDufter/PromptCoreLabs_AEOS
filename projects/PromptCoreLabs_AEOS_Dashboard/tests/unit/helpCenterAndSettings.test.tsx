import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { I18nProvider } from '../../src/i18n/I18nContext';
import { HelpCenterModal } from '../../src/components/help/HelpCenterModal';
import { SettingsModal } from '../../src/components/admin/SettingsModal';
import { RightSidebarStatus } from '../../src/components/layout/RightSidebarStatus';
import { UserProfile } from '../../src/types';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const MOCK_USER: UserProfile = {
  id: 'usr_test',
  name: 'Operador Teste',
  email: 'teste@promptcorelabs.com',
  avatar: 'OT',
  role: 'System Admin',
  squad: 'Enterprise Core',
  activeSessions: 1,
  maxSessions: 2,
  twoFactorEnabled: true,
  ssoConnected: true,
  dailyTokenLimit: 100000,
  allowedTimeWindow: '24/7'
};

describe('UI Hygiene: HelpCenter, SettingsModal (Auto-Save) e RightSidebarStatus', () => {
  it('HelpCenterModal filtra tópicos em tempo real na busca e exibe porta correta :20130 (zero :8000)', () => {
    render(
      <I18nProvider initialLang="pt">
        <HelpCenterModal isOpen={true} onClose={() => {}} />
      </I18nProvider>
    );

    const searchInput = screen.getByPlaceholderText(/Pesquisar tópico ou parâmetro/i);
    fireEvent.change(searchInput, { target: { value: '20130' } });

    const resultsBox = screen.getByTestId('help-search-results');
    expect(resultsBox).toBeInTheDocument();
    expect(resultsBox.textContent).toContain('OmniRoute');
    expect(document.body.textContent).not.toContain(':8000');

    const hit = screen.getByTestId('help-search-hit-t-ports');
    fireEvent.click(hit);
    expect(screen.getByText(/Troubleshooting & Matriz de Portas Locais/i)).toBeInTheDocument();
    expect(screen.getByText(':20130')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Pesquisar tópico ou parâmetro/i), {
      target: { value: 'termo-inexistente-xyz999' }
    });
    expect(screen.getByTestId('help-search-empty')).toBeInTheDocument();
  });

  it('SettingsModal aplica Auto-Save imediato sem botões enganosos de Cancelar/Salvar Alterações', () => {
    const onLanguageChange = vi.fn();
    const onThemeToggle = vi.fn();
    const onClose = vi.fn();

    render(
      <I18nProvider initialLang="pt">
        <SettingsModal
          user={MOCK_USER}
          defaultTab="general"
          lang="pt"
          onLanguageChange={onLanguageChange}
          theme="light"
          onThemeToggle={onThemeToggle}
          onClose={onClose}
        />
      </I18nProvider>
    );

    expect(screen.getByText(/Auto-Save em tempo real ativo/i)).toBeInTheDocument();
    expect(screen.getByTestId('settings-close-footer')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Salvar Alterações/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Cancelar$/i })).toBeNull();

    const enCard = screen.getByText(/English \(United States\)/i);
    fireEvent.click(enCard);
    expect(onLanguageChange).toHaveBeenCalledWith('en');
    expect(screen.getByTestId('settings-autosave-toast')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('settings-close-footer'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('RightSidebarStatus não injeta sessões fake da Companion Extension no estado inicial', () => {
    render(
      <RightSidebarStatus
        collapsed={false}
        onToggleCollapse={() => {}}
        agents={[]}
        mode="telemetry"
      />
    );

    const extHeaderBtn = screen.getByText(/Extensões Injetadas \(0\)/i);
    fireEvent.click(extHeaderBtn);

    expect(screen.getByTestId('companion-extensions-empty')).toBeInTheDocument();
    expect(screen.queryByText('Salesforce CRM')).toBeNull();
    expect(screen.queryByText('Jira Enterprise')).toBeNull();
    expect(screen.queryByText('SAP S/4HANA')).toBeNull();
  });
});
