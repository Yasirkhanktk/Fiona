import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Briefcase, TrendingUp, DollarSign } from 'lucide-react';

export function FunderPortfolio() {
  const { loans } = useData();
  const { user } = useAuth();

  const myLoans = loans.filter((l) => l.funderId === user?.companyId);

  const stats = [
    {
      title: 'Total Loans',
      value: myLoans.length,
      icon: Briefcase,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Active Loans',
      value: myLoans.filter((l) => l.status === 'active').length,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Total Investment',
      value: `$${(myLoans.reduce((sum, l) => sum + l.amount, 0) / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Credit Portfolio</h2>
          <p className="text-sm text-slate-600">View and manage your funded loans</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio by Currency</CardTitle>
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
                  <div className="text-sm text-slate-600">Total invested</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Funded Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Credit ID</TableHead>
                <TableHead>Originator</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Maturity Date</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.creditId}</TableCell>
                  <TableCell>{loan.originatorName}</TableCell>
                  <TableCell className="font-semibold">
                    {loan.currency === 'USD' ? '$' : loan.currency === 'EUR' ? '€' : '£'}
                    {loan.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{loan.currency}</TableCell>
                  <TableCell>{loan.interestRate}%</TableCell>
                  <TableCell>{loan.maturityDate}</TableCell>
                  <TableCell className="font-semibold">
                    {loan.currency === 'USD' ? '$' : loan.currency === 'EUR' ? '€' : '£'}
                    {loan.outstandingBalance.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        loan.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : loan.status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }
                    >
                      {loan.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}