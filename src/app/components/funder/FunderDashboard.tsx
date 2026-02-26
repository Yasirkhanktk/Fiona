import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckSquare, Briefcase, AlertCircle, TrendingUp, LayoutDashboard, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export function FunderDashboard() {
  const { loanRequests, loans } = useData();
  const { user } = useAuth();

  const myLoans = loans.filter((l) => l.funderId === user?.companyId);
  const pendingApprovals = loanRequests.filter((d) => d.status === 'under_review_funder' || (d.status === 'submitted')).length;

  const stats = [
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      subtitle: 'Awaiting final approval',
      icon: CheckSquare,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Total Portfolio',
      value: myLoans.length,
      subtitle: `$${(myLoans.reduce((sum, l) => sum + l.amount, 0) / 1000).toFixed(0)}K`,
      icon: Briefcase,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Overdue Loans',
      value: myLoans.filter((l) => l.status === 'overdue').length,
      subtitle: 'Requiring action',
      icon: AlertCircle,
      color: 'from-red-500 to-orange-600',
    },
    {
      title: 'Active Loans',
      value: myLoans.filter((l) => l.status === 'active').length,
      subtitle: 'Current portfolio',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Funder Dashboard</h2>
          <p className="text-sm text-slate-600">Capital management and approval oversight</p>
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
              <Card className="border-2 border-slate-200 hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden">
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
                  <div className={`h-1 w-full rounded-full overflow-hidden ${stat.color.includes('blue') ? 'bg-blue-50' : stat.color.includes('amber') || stat.color.includes('orange') ? 'bg-amber-50' : stat.color.includes('red') ? 'bg-red-50' : 'bg-green-50'}`}>
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
          <Link to="/funder/approvals">
            <Button className="w-full justify-start gap-3 h-auto py-4 bg-gradient-to-r from-amber-600 to-orange-600">
              <CheckSquare className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">Review Approvals</div>
                <div className="text-xs opacity-90">Manage disbursement approvals</div>
              </div>
            </Button>
          </Link>

          <Link to="/funder/portfolio">
            <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 border-2">
              <Briefcase className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">View Portfolio</div>
                <div className="text-xs text-slate-600">Access your investment portfolio</div>
              </div>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}