import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertCircle, DollarSign, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function FunderOverdue() {
  const { loans } = useData();
  const { user } = useAuth();

  const overdueLoans = loans.filter(
    (l) => l.funderId === user?.companyId && l.status === 'overdue'
  );

  const handleProceedPayment = (creditId: string) => {
    toast.success(`Payment call initiated for ${creditId}`);
  };

  const handleProceedReplacement = (creditId: string) => {
    toast.info(`Replacement call initiated for ${creditId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Overdue Loan Actions</h2>
          <p className="text-sm text-slate-600">Manage overdue loans and recovery actions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <DollarSign className="w-5 h-5" />
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700">
              ${(overdueLoans.reduce((sum, l) => sum + l.outstandingBalance, 0) / 1000).toFixed(0)}
              K
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overdue Loans Requiring Action</CardTitle>
        </CardHeader>
        <CardContent>
          {overdueLoans.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Overdue Loans</h3>
              <p className="text-slate-600">All loans are performing well!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credit ID</TableHead>
                  <TableHead>Originator</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Maturity</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Actions</TableHead>
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
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleProceedPayment(loan.creditId)}
                            className="gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            Call Payment
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleProceedReplacement(loan.creditId)}
                            className="gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Call Replacement
                          </Button>
                        </div>
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