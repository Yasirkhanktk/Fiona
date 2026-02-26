import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Activity,
  Bell,
  Database,
  Shield,
  Settings,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useState } from 'react';

export function SystemControl() {
  const { loans, loanRequests, environments } = useData();
  const [systemSettings, setSystemSettings] = useState({
    deliveryVsPayment: true,
    autoNotifications: true,
    systemAudit: true,
    realTimeAlerts: true,
  });

  const systemMetrics = [
    {
      label: 'System Uptime',
      value: '99.98%',
      icon: Activity,
      color: 'from-green-500 to-emerald-600',
    },
    {
      label: 'Active Environments',
      value: environments.filter((e) => e.status === 'active').length,
      icon: Database,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      label: 'Total Portfolio Value',
      value: `$${(loans.reduce((sum, l) => sum + l.amount, 0) / 1000000).toFixed(2)}M`,
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      label: 'Security Status',
      value: 'Protected',
      icon: Shield,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const notifications = [
    {
      type: 'success',
      message: 'System backup completed successfully',
      time: '10 minutes ago',
    },
    {
      type: 'info',
      message: 'New disbursement request submitted',
      time: '1 hour ago',
    },
    {
      type: 'warning',
      message: 'Loan CR-2024-004 is overdue',
      time: '2 hours ago',
    },
    {
      type: 'success',
      message: 'Environment configuration updated',
      time: '3 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Control</h2>
          <p className="text-sm text-slate-600">Platform-wide settings and monitoring</p>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {metric.label}
                  </CardTitle>
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              System Settings
            </CardTitle>
            <CardDescription>Configure platform-wide features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
              <div className="space-y-1">
                <Label htmlFor="dvp" className="text-base font-medium">
                  Delivery vs Payment Execution
                </Label>
                <p className="text-sm text-slate-600">
                  Enable simultaneous transaction execution
                </p>
              </div>
              <Switch
                id="dvp"
                checked={systemSettings.deliveryVsPayment}
                onCheckedChange={(checked) =>
                  setSystemSettings({ ...systemSettings, deliveryVsPayment: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
              <div className="space-y-1">
                <Label htmlFor="notifications" className="text-base font-medium">
                  Automated Notifications
                </Label>
                <p className="text-sm text-slate-600">Send alerts for key events</p>
              </div>
              <Switch
                id="notifications"
                checked={systemSettings.autoNotifications}
                onCheckedChange={(checked) =>
                  setSystemSettings({ ...systemSettings, autoNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
              <div className="space-y-1">
                <Label htmlFor="audit" className="text-base font-medium">
                  System Audit Trail
                </Label>
                <p className="text-sm text-slate-600">Maintain comprehensive audit logs</p>
              </div>
              <Switch
                id="audit"
                checked={systemSettings.systemAudit}
                onCheckedChange={(checked) =>
                  setSystemSettings({ ...systemSettings, systemAudit: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
              <div className="space-y-1">
                <Label htmlFor="alerts" className="text-base font-medium">
                  Real-time Alerts
                </Label>
                <p className="text-sm text-slate-600">
                  Push notifications for critical events
                </p>
              </div>
              <Switch
                id="alerts"
                checked={systemSettings.realTimeAlerts}
                onCheckedChange={(checked) =>
                  setSystemSettings({ ...systemSettings, realTimeAlerts: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* System Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              System Notifications
            </CardTitle>
            <CardDescription>Recent platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50"
                >
                  {notification.type === 'success' && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                  {notification.type === 'warning' && (
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                  )}
                  {notification.type === 'info' && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-2">
                Pending Loan Requests
              </div>
              <div className="text-3xl font-bold text-blue-700 mb-1">
                {loanRequests.filter((d) => d.status === 'submitted' || d.status === 'under_review_supervisor' || d.status === 'under_review_funder').length}
              </div>
              <div className="text-sm text-blue-600">
                Total: $
                {(
                  loanRequests
                    .filter((d) => d.status === 'submitted' || d.status === 'under_review_supervisor' || d.status === 'under_review_funder')
                    .reduce((sum, d) => sum + d.amount, 0) / 1000
                ).toFixed(0)}
                K
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-sm font-medium text-green-900 mb-2">Active Loans</div>
              <div className="text-3xl font-bold text-green-700 mb-1">
                {loans.filter((l) => l.status === 'active').length}
              </div>
              <div className="text-sm text-green-600">
                Total: $
                {(
                  loans
                    .filter((l) => l.status === 'active')
                    .reduce((sum, l) => sum + l.outstandingBalance, 0) / 1000
                ).toFixed(0)}
                K
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="text-sm font-medium text-amber-900 mb-2">Overdue Loans</div>
              <div className="text-3xl font-bold text-amber-700 mb-1">
                {loans.filter((l) => l.status === 'overdue').length}
              </div>
              <div className="text-sm text-amber-600">
                Total: $
                {(
                  loans
                    .filter((l) => l.status === 'overdue')
                    .reduce((sum, l) => sum + l.outstandingBalance, 0) / 1000
                ).toFixed(0)}
                K
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
          <CardDescription>Administrative operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-6 flex-col gap-2">
              <Database className="w-6 h-6" />
              <span>Backup Data</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col gap-2">
              <Activity className="w-6 h-6" />
              <span>View Logs</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col gap-2">
              <Shield className="w-6 h-6" />
              <span>Security Audit</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col gap-2">
              <Settings className="w-6 h-6" />
              <span>Advanced Config</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}