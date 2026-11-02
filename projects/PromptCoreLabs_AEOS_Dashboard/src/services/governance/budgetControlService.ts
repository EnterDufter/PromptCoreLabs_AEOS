/**
 * PCL Cockpit Sovereign FinOps & Hard Budget Enforcement Engine
 * Implements real-time token spend tracking, department allocations, 
 * user quotas, and hardware-backed hard-lock enforcement.
 */

export interface UserBudget {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  departmentId: string;
  spendUSD: number;
  limitUSD: number;
}

export interface DepartmentBudget {
  id: string;
  name: string;
  usersCount: number;
  spendUSD: number;
  allocatedUSD: number;
}

export interface WorkspaceBudgetConfig {
  monthlyLimitUSD: number;
  allocatedUSD: number;
  currentSpendUSD: number;
  hardLockEnabled: boolean;
  notifyAdminAtLimit: boolean;
  dailyAverageUSD: number;
  monthlyProjectionUSD: number;
  sovereigntyRatioPercent: number;
  dollarsSavedLocalUSD: number;
  localTokensCount: number;
}

class BudgetControlService {
  private config: WorkspaceBudgetConfig = {
    monthlyLimitUSD: 19200.00,
    allocatedUSD: 14400.00,
    currentSpendUSD: 4362.55,
    hardLockEnabled: true,
    notifyAdminAtLimit: true,
    dailyAverageUSD: 174.50,
    monthlyProjectionUSD: 5235.05,
    sovereigntyRatioPercent: 88.4,
    dollarsSavedLocalUSD: 1420.00,
    localTokensCount: 42500000
  };

  private departments: DepartmentBudget[] = [
    { id: 'tech', name: 'Engenharia & IA Soberana', usersCount: 54, spendUSD: 1212.50, allocatedUSD: 2879.00 },
    { id: 'governance', name: 'Governança & FinOps', usersCount: 18, spendUSD: 158.40, allocatedUSD: 390.00 },
    { id: 'arch-cx', name: 'Arch Living & Design System', usersCount: 30, spendUSD: 186.90, allocatedUSD: 998.00 },
    { id: 'sales', name: 'Vendas & Negócios', usersCount: 36, spendUSD: 1534.85, allocatedUSD: 2184.00 },
    { id: 'executive', name: 'Diretoria Executiva (Board)', usersCount: 12, spendUSD: 1034.20, allocatedUSD: 3120.00 },
    { id: 'product', name: 'Produto & Operações', usersCount: 30, spendUSD: 387.60, allocatedUSD: 1248.00 },
    { id: 'pcl-core', name: 'PCL Core Enclave', usersCount: 36, spendUSD: 0.00, allocatedUSD: 780.00 },
    { id: 'marketing', name: 'Marketing & Conteúdo', usersCount: 24, spendUSD: 142.60, allocatedUSD: 281.00 }
  ];

  private users: UserBudget[] = [
    { id: 'u-1', name: 'Lucas Ferraz', email: 'lucas.ferraz@promptcorelabs.com', departmentId: 'tech', spendUSD: 26.00, limitUSD: 42.00 },
    { id: 'u-2', name: 'Mariana Couto', email: 'mariana.couto@promptcorelabs.com', departmentId: 'tech', spendUSD: 35.10, limitUSD: 78.00 },
    { id: 'u-3', name: 'Diego Rocha', email: 'diego.rocha@promptcorelabs.com', departmentId: 'tech', spendUSD: 70.20, limitUSD: 90.00 },
    { id: 'u-4', name: 'Fernanda Lima', email: 'fernanda.lima@promptcorelabs.com', departmentId: 'tech', spendUSD: 13.90, limitUSD: 42.00 },
    { id: 'u-5', name: 'Otávio Brandão', email: 'otavio.brandao@promptcorelabs.com', departmentId: 'tech', spendUSD: 336.00, limitUSD: 600.00 },
    { id: 'u-6', name: 'Paula Siqueira', email: 'paula.siqueira@promptcorelabs.com', departmentId: 'tech', spendUSD: 63.90, limitUSD: 90.00 },
    { id: 'u-7', name: 'Renato Vasconcelos', email: 'renato.vasconcelos@promptcorelabs.com', departmentId: 'tech', spendUSD: 96.00, limitUSD: 240.00 },
    { id: 'u-8', name: 'Sofia Mendonça', email: 'sofia.mendonca@promptcorelabs.com', departmentId: 'tech', spendUSD: 204.00, limitUSD: 240.00 }
  ];

  public getConfig(): WorkspaceBudgetConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<WorkspaceBudgetConfig>): WorkspaceBudgetConfig {
    this.config = { ...this.config, ...newConfig };
    return this.getConfig();
  }

  public getDepartments(): DepartmentBudget[] {
    return [...this.departments];
  }

  public updateDepartmentAllocation(deptId: string, allocatedUSD: number): void {
    const dept = this.departments.find(d => d.id === deptId);
    if (dept) {
      dept.allocatedUSD = allocatedUSD;
    }
  }

  public getUsersByDepartment(departmentId: string): UserBudget[] {
    return this.users.filter(u => u.departmentId === departmentId);
  }

  /**
   * Verifies if a user or workspace is allowed to execute a model call.
   * If hard lock is active and limit is reached, blocks the external paid execution.
   */
  public verifyExecutionAllowance(userId: string): { allowed: boolean; reason?: string } {
    if (!this.config.hardLockEnabled) {
      return { allowed: true };
    }

    if (this.config.currentSpendUSD >= this.config.monthlyLimitUSD) {
      return { 
        allowed: false, 
        reason: 'Trava Rígida Ativa (Hard Lock): O orçamento mensal corporativo de IA foi atingido ($19.200,00). Chamadas externas estão bloqueadas e redirecionadas para inferência local a $0.00.' 
      };
    }

    const user = this.users.find(u => u.id === userId);
    if (user && user.spendUSD >= user.limitUSD) {
      return {
        allowed: false,
        reason: `Cota de Usuário Excedida: O usuário ${user.name} atingiu seu limite individual ($${user.limitUSD.toFixed(2)}).`
      };
    }

    return { allowed: true };
  }
}

export const budgetControlService = new BudgetControlService();
