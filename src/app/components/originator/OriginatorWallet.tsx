import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, DollarSign } from 'lucide-react';
import { Badge } from '../ui/badge';

export function OriginatorWallet() {
  const transactions = [
    {
      type: 'inbound',
      description: 'Disbursement received - CR-2024-002',
      amount: 75000,
      currency: 'USD',
      date: '2024-02-18',
      status: 'completed',
    },
    {
      type: 'outbound',
      description: 'Loan repayment collected - CR-2024-003',
      amount: 10000,
      currency: 'USD',
      date: '2024-02-15',
      status: 'completed',
    },
    {
      type: 'inbound',
      description: 'Capital call received',
      amount: 50000,
      currency: 'USD',
      date: '2024-02-10',
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Wallet & Custody</h2>
          <p className="text-sm text-slate-600">Manage transactions and custody operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Wallet className="w-5 h-5" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">$125,000</div>
            <p className="text-blue-100 text-sm">USD</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <ArrowDownRight className="w-5 h-5" />
              Total Inbound
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">$175,000</div>
            <p className="text-slate-600 text-sm">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <ArrowUpRight className="w-5 h-5" />
              Total Outbound
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">$50,000</div>
            <p className="text-slate-600 text-sm">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'inbound' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {transaction.type === 'inbound' ? (
                      <ArrowDownRight className="w-6 h-6 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-slate-600">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      transaction.type === 'inbound' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'inbound' ? '+' : '-'}$
                    {transaction.amount.toLocaleString()}
                  </p>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 border-green-300"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-3" variant="outline">
              <DollarSign className="w-5 h-5" />
              Execute Disbursement
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline">
              <ArrowDownRight className="w-5 h-5" />
              Receive Payment
            </Button>
            <Button className="w-full justify-start gap-3" variant="outline">
              <Clock className="w-5 h-5" />
              View Transaction History
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custody Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-600 mb-1">Account Number</p>
                <p className="font-mono font-bold">CUST-ORG-2024-001</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-600 mb-1">Custody Balance</p>
                <p className="font-bold text-2xl">$125,000 USD</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900 mb-1">Delivery vs Payment</p>
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                  Enabled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}