import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileCheck, Briefcase, AlertCircle, TrendingUp, LayoutDashboard, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export function SupervisorDashboard() {
  const { loanRequests, loans } = useData();

  const pendingValidations = loanRequests.filter((d) => d.status === 'submitted' || d.status === 'under_review_supervisor').length;
  const totalLoans = loans.length;
  const overdueLoans = loans.filter((l) => l.status === 'overdue').length;
  const totalPortfolioValue = loans.reduce((sum, l) => sum + l.amount, 0);

  const stats = [
    {
      title: 'Pending Validations',
      value: pendingValidations,
      subtitle: 'Awaiting review',
      icon: FileCheck,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Total Portfolio',
      value: totalLoans,
      subtitle: `$${(totalPortfolioValue / 1000).toFixed(0)}K`,
      icon: Briefcase,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Overdue Loans',
      value: overdueLoans,
      subtitle: 'Requiring attention',
      icon: AlertCircle,
      color: 'from-red-500 to-orange-600',
    },
    {
      title: 'Approval Rate',
      value: '92%',
      subtitle: 'Last 30 days',
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Supervisor Dashboard</h2>
          <p className="text-sm text-slate-600">Oversight and validation management</p>
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
              <Card className="border-2 border-slate-200 hover:shadow-xl hover:border-green-200 transition-all duration-300 overflow-hidden">
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
                  <div className={`h-1 w-full rounded-full overflow-hidden ${stat.color.includes('blue') ? 'bg-blue-50' : stat.color.includes('green') ? 'bg-green-50' : stat.color.includes('red') ? 'bg-red-50' : 'bg-purple-50'}`}>
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

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/supervisor/validation">
            <Button className="w-full justify-start gap-3 h-auto py-4 bg-gradient-to-r from-green-600 to-emerald-600">
              <FileCheck className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Validate Disbursements</div>
                <div className="text-xs opacity-90">Review pending requests</div>
              </div>
            </Button>
          </Link>

          <Link to="/supervisor/portfolio">
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 border-2">
              <Briefcase className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">View Portfolio</div>
                <div className="text-xs text-slate-600">Access full credit portfolio</div>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}