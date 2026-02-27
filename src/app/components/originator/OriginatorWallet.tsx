import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Wallet, ArrowUpRight, ArrowDownRight, Clock, DollarSign, TrendingUp, Globe, ArrowRightLeft, Send, Download, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface CurrencyWallet {
  currency: string;
  symbol: string;
  balance: number;
  flag: string;
  gradient: string;
  change24h: number;
}

export function OriginatorWallet() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [manageCurrencyOpen, setManageCurrencyOpen] = useState(false);
  const [currencyToManage, setCurrencyToManage] = useState<CurrencyWallet | null>(null);

  const wallets: CurrencyWallet[] = [
    {
      currency: 'USD',
      symbol: '$',
      balance: 125000,
      flag: '🇺🇸',
      gradient: 'from-blue-500 to-cyan-600',
      change24h: 2.5,
    },
    {
      currency: 'GBP',
      symbol: '£',
      balance: 85000,
      flag: '🇬🇧',
      gradient: 'from-indigo-500 to-purple-600',
      change24h: 1.8,
    },
    {
      currency: 'EUR',
      symbol: '€',
      balance: 95000,
      flag: '🇪🇺',
      gradient: 'from-violet-500 to-purple-600',
      change24h: -0.5,
    },
    {
      currency: 'COP',
      symbol: '$',
      balance: 420000000,
      flag: '🇨🇴',
      gradient: 'from-yellow-500 to-orange-600',
      change24h: 3.2,
    },
  ];

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
      amount: 42000,
      currency: 'GBP',
      date: '2024-02-17',
      status: 'completed',
    },
    {
      type: 'inbound',
      description: 'Capital call received',
      amount: 50000,
      currency: 'EUR',
      date: '2024-02-15',
      status: 'completed',
    },
    {
      type: 'outbound',
      description: 'Payment processed - CR-2024-001',
      amount: 180000000,
      currency: 'COP',
      date: '2024-02-14',
      status: 'completed',
    },
    {
      type: 'inbound',
      description: 'Interest income received',
      amount: 8500,
      currency: 'USD',
      date: '2024-02-12',
      status: 'completed',
    },
  ];

  const selectedWallet = wallets.find(w => w.currency === selectedCurrency) || wallets[0];

  const getTotalInUSD = () => {
    // Simplified conversion rates for demo
    const rates: { [key: string]: number } = { USD: 1, GBP: 1.27, EUR: 1.09, COP: 0.00025 };
    return wallets.reduce((total, wallet) => {
      return total + (wallet.balance * rates[wallet.currency]);
    }, 0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Multi-Currency Wallet</h2>
          <p className="text-sm text-slate-600">Manage transactions across multiple currencies</p>
        </div>
      </div>

      {/* Total Portfolio Value */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3djFoLTd6bTAgM2g3djFoLTd6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <CardContent className="pt-8 pb-8 relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-blue-100 text-sm mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Total Portfolio Value (USD Equivalent)
                </p>
                <div className="text-5xl font-bold mb-2">
                  ${getTotalInUSD().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">+2.8% this month</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/20">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Exchange
                </Button>
                <Button className="bg-white hover:bg-slate-100 text-blue-600 font-semibold">
                  <ArrowDownRight className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
              </div>
            </div>

            {/* Currency Distribution */}
            <div className="grid grid-cols-4 gap-4">
              {wallets.map((wallet) => (
                <div key={wallet.currency} className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{wallet.flag}</span>
                    <span className="font-semibold">{wallet.currency}</span>
                  </div>
                  <div className="text-xl font-bold mb-1">
                    {wallet.symbol}{wallet.balance.toLocaleString()}
                  </div>
                  <div className={`text-xs font-semibold ${wallet.change24h >= 0 ? 'text-blue-200' : 'text-red-300'}`}>
                    {wallet.change24h >= 0 ? '+' : ''}{wallet.change24h}% 24h
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Currency Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {wallets.map((wallet, index) => (
          <motion.div
            key={wallet.currency}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-2xl border-2 ${
                selectedCurrency === wallet.currency 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-transparent hover:border-blue-300'
              }`}
              onClick={() => setSelectedCurrency(wallet.currency)}
            >
              <CardContent className="pt-6">
                <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${wallet.gradient} p-4 mb-4 shadow-lg`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-white/80 text-sm font-medium">Available Balance</div>
                    <div className="text-3xl">{wallet.flag}</div>
                  </div>
                  <div className="text-white text-2xl font-bold mb-1">
                    {wallet.symbol}{wallet.balance.toLocaleString()}
                  </div>
                  <div className="text-white/90 text-sm font-semibold">{wallet.currency}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">24h Change</span>
                    <span className={`font-semibold flex items-center gap-1 ${
                      wallet.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {wallet.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                      {wallet.change24h >= 0 ? '+' : ''}{wallet.change24h}%
                    </span>
                  </div>
                  <Button 
                    variant={selectedCurrency === wallet.currency ? "default" : "outline"}
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setCurrencyToManage(wallet);
                      setManageCurrencyOpen(true);
                    }}
                  >
                    Manage {wallet.currency}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Transactions Section */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-[400px] grid-cols-3">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="inbound">Inbound</TabsTrigger>
            <TabsTrigger value="outbound">Outbound</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            View History
          </Button>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === 'inbound' 
                            ? 'bg-gradient-to-br from-green-100 to-emerald-100' 
                            : 'bg-gradient-to-br from-red-100 to-rose-100'
                        }`}
                      >
                        {transaction.type === 'inbound' ? (
                          <ArrowDownRight className="w-6 h-6 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-slate-600">{transaction.date}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.currency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-xl mb-1 ${
                          transaction.type === 'inbound' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'inbound' ? '+' : '-'}
                        {wallets.find(w => w.currency === transaction.currency)?.symbol}
                        {transaction.amount.toLocaleString()}
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700 border-green-300"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inbound" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Inbound Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.filter(t => t.type === 'inbound').map((transaction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                        <ArrowDownRight className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-slate-600">{transaction.date}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.currency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl mb-1 text-green-600">
                        +{wallets.find(w => w.currency === transaction.currency)?.symbol}
                        {transaction.amount.toLocaleString()}
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700 border-green-300"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outbound" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Outbound Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.filter(t => t.type === 'outbound').map((transaction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-red-100 to-rose-100">
                        <ArrowUpRight className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-slate-600">{transaction.date}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.currency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl mb-1 text-red-600">
                        -{wallets.find(w => w.currency === transaction.currency)?.symbol}
                        {transaction.amount.toLocaleString()}
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-700 border-green-300"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions & Custody */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" size="lg">
              <DollarSign className="w-5 h-5" />
              Execute Disbursement
            </Button>
            <Button className="w-full justify-start gap-3 h-12" variant="outline" size="lg">
              <ArrowDownRight className="w-5 h-5" />
              Receive Payment
            </Button>
            <Button className="w-full justify-start gap-3 h-12" variant="outline" size="lg">
              <ArrowRightLeft className="w-5 h-5" />
              Currency Exchange
            </Button>
            <Button className="w-full justify-start gap-3 h-12" variant="outline" size="lg">
              <Clock className="w-5 h-5" />
              Transaction History
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              Custody Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border-2 border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Primary Account Number</p>
                <p className="font-mono font-bold text-lg">CUST-ORG-2024-001</p>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                <p className="text-sm text-blue-900 mb-2 font-semibold">Multi-Currency Support</p>
                <div className="flex gap-2 flex-wrap">
                  {wallets.map(wallet => (
                    <Badge key={wallet.currency} className="bg-white text-blue-700 border border-blue-300">
                      {wallet.flag} {wallet.currency}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-green-900 font-semibold">Delivery vs Payment</p>
                  <Badge className="bg-green-600 text-white">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manage Currency Dialog */}
      <Dialog open={manageCurrencyOpen} onOpenChange={setManageCurrencyOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <span className="text-4xl">{currencyToManage?.flag}</span>
              Manage {currencyToManage?.currency} Wallet
            </DialogTitle>
          </DialogHeader>
          
          {currencyToManage && (
            <div className="space-y-6">
              {/* Balance Card */}
              <div className={`p-6 rounded-xl bg-gradient-to-br ${currencyToManage.gradient} text-white shadow-lg`}>
                <p className="text-white/80 text-sm mb-2">Available Balance</p>
                <p className="text-4xl font-bold mb-2">
                  {currencyToManage.symbol}{currencyToManage.balance.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${currencyToManage.change24h >= 0 ? '' : 'rotate-180'}`} />
                  <span className="text-sm font-semibold">
                    {currencyToManage.change24h >= 0 ? '+' : ''}{currencyToManage.change24h}% (24h)
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-slate-600 mb-1">This Month</p>
                    <p className="text-xl font-bold text-green-600">
                      +{currencyToManage.symbol}{(currencyToManage.balance * 0.15).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-slate-600 mb-1">Reserved</p>
                    <p className="text-xl font-bold text-amber-600">
                      {currencyToManage.symbol}{(currencyToManage.balance * 0.25).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-slate-600 mb-1">Pending</p>
                    <p className="text-xl font-bold text-blue-600">
                      {currencyToManage.symbol}{(currencyToManage.balance * 0.1).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-16 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                    <Send className="w-5 h-5 mr-2" />
                    Send {currencyToManage.currency}
                  </Button>
                  <Button className="h-16" variant="outline">
                    <Download className="w-5 h-5 mr-2" />
                    Receive {currencyToManage.currency}
                  </Button>
                  <Button className="h-16" variant="outline">
                    <ArrowRightLeft className="w-5 h-5 mr-2" />
                    Exchange Currency
                  </Button>
                  <Button className="h-16" variant="outline">
                    <Clock className="w-5 h-5 mr-2" />
                    Transaction History
                  </Button>
                </div>
              </div>

              {/* Recent Transactions for this currency */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Recent {currencyToManage.currency} Transactions</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {transactions
                    .filter(t => t.currency === currencyToManage.currency)
                    .map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === 'inbound'
                                ? 'bg-green-100'
                                : 'bg-red-100'
                            }`}
                          >
                            {transaction.type === 'inbound' ? (
                              <ArrowDownRight className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-slate-600">{transaction.date}</p>
                          </div>
                        </div>
                        <p
                          className={`font-bold ${
                            transaction.type === 'inbound' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'inbound' ? '+' : '-'}
                          {currencyToManage.symbol}
                          {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Exchange Rates */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Exchange Rates</h3>
                <div className="grid grid-cols-3 gap-3">
                  {wallets
                    .filter(w => w.currency !== currencyToManage.currency)
                    .map(wallet => {
                      const rates: { [key: string]: { [key: string]: number } } = {
                        USD: { GBP: 0.79, EUR: 0.92, COP: 3960 },
                        GBP: { USD: 1.27, EUR: 1.16, COP: 5019 },
                        EUR: { USD: 1.09, GBP: 0.86, COP: 4322 },
                        COP: { USD: 0.00025, GBP: 0.0002, EUR: 0.00023 }
                      };
                      const rate = rates[currencyToManage.currency]?.[wallet.currency] || 1;
                      
                      return (
                        <Card key={wallet.currency} className="border-2 hover:border-blue-300 transition-colors">
                          <CardContent className="pt-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl">{wallet.flag}</span>
                              <span className="font-semibold text-sm">{wallet.currency}</span>
                            </div>
                            <p className="text-xs text-slate-600">
                              1 {currencyToManage.currency} = {rate.toLocaleString()} {wallet.currency}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}