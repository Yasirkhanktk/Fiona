import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText, Briefcase, AlertCircle, TrendingUp, DollarSign, Clock, LayoutDashboard, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export function OriginatorDashboard() {
  const { loanRequests, loans } = useData();
  const { user } = useAuth();

  // Filter data for current originator
  const myLoanRequests = loanRequests.filter((d) => d.originatorId === user?.companyId);
  const myLoans = loans.filter((l) => l.originatorId === user?.companyId);

  const stats = [
    {
      title: 'Pending Requests',
      value: myLoanRequests.filter((d) => d.status === 'submitted' || d.status.includes('review')).length,
      subtitle: `$${(
        myLoanRequests
          .filter((d) => d.status === 'submitted' || d.status.includes('review'))
          .reduce((sum, d) => sum + d.amount, 0) / 1000
      ).toFixed(0)}K pending`,
      icon: FileText,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Active Loans',
      value: myLoans.filter((l) => l.status === 'active').length,
      subtitle: `$${(
        myLoans
          .filter((l) => l.status === 'active')
          .reduce((sum, l) => sum + l.amount, 0) / 1000
      ).toFixed(0)}K`,
      icon: Briefcase,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Overdue Loans',
      value: myLoans.filter((l) => l.status === 'overdue').length,
      subtitle: `$${(
        myLoans
          .filter((l) => l.status === 'overdue')
          .reduce((sum, l) => sum + l.outstandingBalance, 0) / 1000
      ).toFixed(0)}K`,
      icon: AlertCircle,
      color: 'from-red-500 to-orange-600',
    },
    {
      title: 'Total Portfolio',
      value: `$${(myLoans.reduce((sum, l) => sum + l.amount, 0) / 1000).toFixed(0)}K`,
      subtitle: `${myLoans.length} loans`,
      icon: TrendingUp,
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  const recentActivity = [
    {
      type: 'disbursement',
      status: 'pending',
      title: 'Disbursement Request Submitted',
      detail: 'CR-2024-001 - $50,000',
      time: '2 hours ago',
    },
    {
      type: 'disbursement',
      status: 'approved',
      title: 'Disbursement Approved',
      detail: 'CR-2024-002 - $75,000',
      time: '5 hours ago',
    },
    {
      type: 'alert',
      status: 'overdue',
      title: 'Loan Overdue Alert',
      detail: 'CR-2024-004 - Action required',
      time: '1 day ago',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
          <LayoutDashboard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Originator Dashboard</h2>
          <p className="text-sm text-slate-600">Operational overview and portfolio management</p>
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
              <Card className="border-2 border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.status === 'approved'
                        ? 'bg-green-100'
                        : activity.status === 'overdue'
                        ? 'bg-red-100'
                        : 'bg-blue-100'
                    }`}
                  >
                    {activity.type === 'disbursement' ? (
                      <FileText
                        className={`w-4 h-4 ${
                          activity.status === 'approved'
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}
                      />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-sm text-slate-600">{activity.detail}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/originator/requests">
              <Button className="w-full justify-start gap-3 h-auto py-4 bg-gradient-to-r from-blue-600 to-cyan-600">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Create Loan Request</div>
                  <div className="text-xs opacity-90">Submit new loan application</div>
                </div>
              </Button>
            </Link>

            <Link to="/originator/portfolio">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-4 border-2"
              >
                <Briefcase className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">View Portfolio</div>
                  <div className="text-xs text-slate-600">Access your credit portfolio</div>
                </div>
              </Button>
            </Link>

            <Link to="/originator/overdue">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-4 border-2 border-red-200 hover:bg-red-50"
              >
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <div className="font-semibold">Manage Overdue Loans</div>
                  <div className="text-xs text-slate-600">Handle overdue payments</div>
                </div>
              </Button>
            </Link>

            <Link to="/originator/wallet">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-auto py-4 border-2"
              >
                <DollarSign className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Wallet & Custody</div>
                  <div className="text-xs text-slate-600">Manage transactions</div>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Summary by Currency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['USD', 'EUR', 'GBP'].map((currency) => {
              const currencyLoans = myLoans.filter((l) => l.currency === currency);
              const totalAmount = currencyLoans.reduce((sum, l) => sum + l.amount, 0);
              return (
                <div key={currency} className="p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{currency}</h3>
                    <Badge variant="secondary">{currencyLoans.length} loans</Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">
                    {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}
                    {(totalAmount / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-slate-600">Total portfolio value</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}