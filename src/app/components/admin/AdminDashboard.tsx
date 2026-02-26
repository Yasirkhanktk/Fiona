import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Building2, Users, Network, TrendingUp, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';

export function AdminDashboard() {
  const { companies, users, environments, loanRequests, loans } = useData();

  const stats = [
    {
      title: 'Total Companies',
      value: companies.length,
      subtitle: `${companies.filter((c) => c.status === 'active').length} active`,
      icon: Building2,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Platform Users',
      value: users.length,
      subtitle: `${users.filter((u) => u.status === 'active').length} active users`,
      icon: Users,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Environments',
      value: environments.length,
      subtitle: `${environments.filter((e) => e.status === 'active').length} active`,
      icon: Network,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Portfolio',
      value: `$${(loans.reduce((sum, l) => sum + l.amount, 0) / 1000).toFixed(0)}K`,
      subtitle: `${loans.length} loans`,
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
    },
  ];

  const recentActivity = [
    {
      type: 'company',
      action: 'New company registered',
      detail: 'Global Capital Fund',
      time: '2 hours ago',
      status: 'success',
    },
    {
      type: 'user',
      action: 'User created',
      detail: 'john@premierlending.com',
      time: '5 hours ago',
      status: 'success',
    },
    {
      type: 'environment',
      action: 'Environment configured',
      detail: 'Global-Premier SME Facility',
      time: '1 day ago',
      status: 'success',
    },
    {
      type: 'alert',
      action: 'Overdue loan detected',
      detail: 'CR-2024-004',
      time: '2 days ago',
      status: 'warning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard</h2>
          <p className="text-sm text-slate-600">System overview and platform management</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="border-2 border-slate-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                        {stat.title}
                      </p>
                      <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {stat.subtitle}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className={`h-1 w-full ${stat.bgColor} rounded-full overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-br from-slate-50 to-white pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-purple-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  {activity.status === 'success' ? (
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800">{activity.action}</p>
                    <p className="text-sm text-slate-600 truncate">{activity.detail}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-2 border-slate-200 shadow-lg">
          <CardHeader className="border-b bg-gradient-to-br from-slate-50 to-white pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                  <span className="font-semibold text-sm text-slate-800">Platform Status</span>
                </div>
                <Badge className="bg-green-600 text-white border-0 shadow-md">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-sm text-slate-800">Active Companies</span>
                </div>
                <Badge className="bg-blue-600 text-white border-0 shadow-md">
                  {companies.filter((c) => c.status === 'active').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
                <div className="flex items-center gap-3">
                  <Network className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-sm text-slate-800">Active Environments</span>
                </div>
                <Badge className="bg-purple-600 text-white border-0 shadow-md">
                  {environments.filter((e) => e.status === 'active').length}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-sm text-slate-800">Pending Requests</span>
                </div>
                <Badge className="bg-amber-600 text-white border-0 shadow-md">
                  {loanRequests.filter((d) => d.status === 'submitted' || d.status === 'under_review_supervisor' || d.status === 'under_review_funder').length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Overview */}
      <Card className="border-2 border-slate-200 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-br from-slate-50 to-white pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-slate-700" />
            Company Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['funder', 'originator', 'supervisor'].map((type, index) => {
              const typeCompanies = companies.filter((c) => c.type === type);
              const colors = {
                funder: { bg: 'from-amber-50 to-orange-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-600' },
                originator: { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-600' },
                supervisor: { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', text: 'text-green-700', icon: 'text-green-600' },
              };
              const color = colors[type as keyof typeof colors];
              
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-xl bg-gradient-to-br ${color.bg} border-2 ${color.border}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className={`w-5 h-5 ${color.icon}`} />
                    <h3 className={`font-bold capitalize ${color.text}`}>{type}s</h3>
                  </div>
                  <div className={`text-3xl font-bold mb-3 ${color.text}`}>{typeCompanies.length}</div>
                  <div className="space-y-2">
                    {typeCompanies.slice(0, 2).map((company) => (
                      <div
                        key={company.id}
                        className="text-xs text-slate-700 flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200"
                      >
                        <span className="truncate font-medium">{company.name}</span>
                        <Badge
                          variant={company.status === 'active' ? 'default' : 'secondary'}
                          className="ml-2 text-[10px]"
                        >
                          {company.status}
                        </Badge>
                      </div>
                    ))}
                    {typeCompanies.length === 0 && (
                      <p className="text-xs text-slate-500 italic">No companies yet</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
