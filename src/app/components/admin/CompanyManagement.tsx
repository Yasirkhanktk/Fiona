import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Plus, Building2, Mail, Calendar, ToggleLeft, ToggleRight, Wallet, Users, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function CompanyManagement() {
  const { companies, addCompany, updateCompany } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '' as 'funder' | 'originator' | 'supervisor' | '',
    contactEmail: '',
    status: 'active' as 'active' | 'inactive',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.type || !formData.contactEmail) {
      toast.error('Please fill all required fields');
      return;
    }

    addCompany({
      name: formData.name,
      type: formData.type as 'funder' | 'originator' | 'supervisor',
      contactEmail: formData.contactEmail,
      status: formData.status,
    });

    toast.success('Company created successfully');
    setIsDialogOpen(false);
    setFormData({ name: '', type: '', contactEmail: '', status: 'active' });
  };

  const toggleCompanyStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateCompany(id, { status: newStatus });
    toast.success(`Company ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'funder':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'originator':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'supervisor':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'funder':
        return Wallet;
      case 'originator':
        return Users;
      case 'supervisor':
        return ShieldCheck;
      default:
        return Building2;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Company Management</h2>
            <p className="text-sm text-slate-600">Create and manage companies on the platform</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg">
              <Plus className="w-4 h-4" />
              Create Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Building2 className="w-5 h-5 text-purple-600" />
                Create New Company
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Add a new company to the platform with the necessary details.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold">Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter company name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-xs font-semibold">Company Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as typeof formData.type })
                  }
                >
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funder">Funder</SelectItem>
                    <SelectItem value="originator">Originator</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold">Contact Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-semibold">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as typeof formData.status })
                  }
                >
                  <SelectTrigger className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                Create Company
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-slate-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{companies.length}</div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Companies</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {['funder', 'originator', 'supervisor'].map((type, index) => {
          const Icon = getTypeIcon(type);
          const colors = {
            funder: 'from-amber-500 to-orange-600',
            originator: 'from-blue-500 to-cyan-600',
            supervisor: 'from-green-500 to-emerald-600',
          };
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
            >
              <Card className="border-2 border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-slate-800 mb-1">
                        {companies.filter((c) => c.type === type).length}
                      </div>
                      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider capitalize">{type}s</div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[type as keyof typeof colors]} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Companies Table */}
      <Card className="border-2 border-slate-200 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-br from-slate-50 to-white pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-slate-700" />
            All Companies
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">Company Name</TableHead>
                  <TableHead className="font-semibold text-slate-700">Type</TableHead>
                  <TableHead className="font-semibold text-slate-700">Contact Email</TableHead>
                  <TableHead className="font-semibold text-slate-700">Created</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company, index) => {
                  const Icon = getTypeIcon(company.type);
                  return (
                    <TableRow key={company.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${
                            company.type === 'funder' ? 'from-amber-500 to-orange-600' :
                            company.type === 'originator' ? 'from-blue-500 to-cyan-600' :
                            'from-green-500 to-emerald-600'
                          } rounded-lg flex items-center justify-center shadow-md`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-semibold text-slate-800">{company.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getTypeColor(company.type)} font-semibold`}>
                          {company.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{company.contactEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{company.createdAt}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            company.status === 'active'
                              ? 'bg-green-600 text-white border-0 shadow-md'
                              : 'bg-slate-400 text-white border-0'
                          }
                        >
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCompanyStatus(company.id, company.status)}
                          className={`gap-2 hover:bg-slate-100 ${
                            company.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          {company.status === 'active' ? (
                            <>
                              <ToggleRight className="w-4 h-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-4 h-4" />
                              Activate
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}