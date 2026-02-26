import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { AlertCircle, Phone } from 'lucide-react';

export function OverdueMonitoring() {
  const { loans } = useData();
  const overdueLoans = loans.filter((l) => l.status === 'overdue');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Overdue Loan Monitoring</h2>
          <p className="text-sm text-slate-600">Track and monitor overdue loans</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Overdue Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{overdueLoans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                ${(overdueLoans.reduce((sum, l) => sum + l.outstandingBalance, 0) / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-slate-600">Total Overdue Amount</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Phone className="w-5 h-5" />
              Tracking Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">{overdueLoans.length * 2}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overdue Loans</CardTitle>
        </CardHeader>
        <CardContent>
          {overdueLoans.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Overdue Loans</h3>
              <p className="text-slate-600">All loans are current</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credit ID</TableHead>
                  <TableHead>Originator</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Maturity Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueLoans.map((loan) => {
                  const daysOverdue = Math.floor(
                    (new Date().getTime() - new Date(loan.maturityDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return (
                    <TableRow key={loan.id} className="bg-red-50">
                      <TableCell className="font-medium">{loan.creditId}</TableCell>
                      <TableCell>{loan.originatorName}</TableCell>
                      <TableCell>${loan.amount.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-red-700">
                        ${loan.outstandingBalance.toLocaleString()}
                      </TableCell>
                      <TableCell>{loan.maturityDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-red-100 text-red-700">
                          {daysOverdue} days
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}