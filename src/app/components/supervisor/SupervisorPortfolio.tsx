import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Briefcase } from 'lucide-react';

export function SupervisorPortfolio() {
  const { loans } = useData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Portfolio Overview</h2>
          <p className="text-sm text-slate-600">Full credit portfolio visibility</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Total Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                ${(loans.reduce((sum, l) => sum + l.amount, 0) / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-slate-600">Total Portfolio Value</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {loans.filter((l) => l.status === 'active').length}
              </div>
              <div className="text-sm text-slate-600">Active Loans</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Credit ID</TableHead>
                <TableHead>Originator</TableHead>
                <TableHead>Funder</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead>Maturity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.creditId}</TableCell>
                  <TableCell>{loan.originatorName}</TableCell>
                  <TableCell>{loan.funderName}</TableCell>
                  <TableCell className="font-semibold">
                    ${loan.amount.toLocaleString()} {loan.currency}
                  </TableCell>
                  <TableCell>{loan.interestRate}%</TableCell>
                  <TableCell>{loan.maturityDate}</TableCell>
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