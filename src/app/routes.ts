import { createBrowserRouter } from 'react-router';
import { LoginPage } from './components/auth/LoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
// import { CompanyManagement } from './components/admin/CompanyManagement';
import { UserManagement } from './components/admin/UserManagement';
import { EnvironmentConfiguration } from './components/admin/EnvironmentConfiguration';
import { SystemControl } from './components/admin/SystemControl';
import { OriginatorLayout } from './components/originator/OriginatorLayout';
import { OriginatorDashboard } from './components/originator/OriginatorDashboard';
import { LoanRequestManagement } from './components/originator/LoanRequestManagement';
import { OriginatorPortfolio } from './components/originator/OriginatorPortfolio';
import { OverdueManagement } from './components/originator/OverdueManagement';
import { OriginatorWallet } from './components/originator/OriginatorWallet';
import { SupervisorLayout } from './components/supervisor/SupervisorLayout';
import { SupervisorDashboard } from './components/supervisor/SupervisorDashboard';
import { DisbursementValidation } from './components/supervisor/DisbursementValidation';
import { SupervisorPortfolio } from './components/supervisor/SupervisorPortfolio';
import { OverdueMonitoring } from './components/supervisor/OverdueMonitoring';
import { FunderLayout } from './components/funder/FunderLayout';
import { FunderDashboard } from './components/funder/FunderDashboard';
import { ApprovalManagement } from './components/funder/ApprovalManagement';
import { FunderPortfolio } from './components/funder/FunderPortfolio';
import { FunderOverdue } from './components/funder/FunderOverdue';
import { FunderWallet } from './components/funder/FunderWallet';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      // { path: 'companies', Component: CompanyManagement },
      { path: 'users', Component: UserManagement },
      { path: 'environments', Component: EnvironmentConfiguration },
      { path: 'system', Component: SystemControl },
    ],
  },
  {
    path: '/originator',
    Component: OriginatorLayout,
    children: [
      { index: true, Component: OriginatorDashboard },
      { path: 'requests', Component: LoanRequestManagement },
      { path: 'portfolio', Component: OriginatorPortfolio },
      { path: 'overdue', Component: OverdueManagement },
      { path: 'wallet', Component: OriginatorWallet },
    ],
  },
  {
    path: '/supervisor',
    Component: SupervisorLayout,
    children: [
      { index: true, Component: SupervisorDashboard },
      { path: 'validation', Component: DisbursementValidation },
      { path: 'portfolio', Component: SupervisorPortfolio },
      { path: 'overdue', Component: OverdueMonitoring },
    ],
  },
  {
    path: '/funder',
    Component: FunderLayout,
    children: [
      { index: true, Component: FunderDashboard },
      { path: 'approvals', Component: ApprovalManagement },
      { path: 'portfolio', Component: FunderPortfolio },
      { path: 'overdue', Component: FunderOverdue },
      { path: 'wallet', Component: FunderWallet },
    ],
  },
]);