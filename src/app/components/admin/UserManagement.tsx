import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Plus, UserCircle, Building2, Mail, Shield, ToggleLeft, ToggleRight, Users as UsersIcon, Wallet, ShieldCheck } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { motion } from 'motion/react';

const availablePermissions = [
  'create_disbursement',
  'view_portfolio',
  'validate_disbursement',
  'approve_disbursement',
  'manage_wallet',
  'view_reports',
  'manage_overdue',
];

export function UserManagement() {
  const { users, companies, addUser, updateUser } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '' as 'admin' | 'originator' | 'supervisor' | 'funder' | '',
    companyId: '',
    status: 'active' as 'active' | 'inactive',
    permissions: [] as string[],
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.role || !formData.companyId) {
      toast.error('Please fill all required fields');
      return;
    }

    const company = companies.find((c) => c.id === formData.companyId);

    addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role as 'admin' | 'originator' | 'supervisor' | 'funder',
      companyId: formData.companyId,
      companyName: company?.name || '',
      status: formData.status,
      permissions: formData.permissions,
    });

    toast.success('User created successfully');
    setIsDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      role: '',
      companyId: '',
      status: 'active',
      permissions: [],
    });
  };

  const toggleUserStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateUser(id, { status: newStatus });
    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-300';
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

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'funder':
        return Wallet;
      case 'originator':
        return UsersIcon;
      case 'supervisor':
        return ShieldCheck;
      default:
        return UserCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <UsersIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
            <p className="text-sm text-slate-600">Create and manage platform users</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg">
              <Plus className="w-4 h-4" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <UserCircle className="w-5 h-5 text-purple-600" />
                Create New User
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500">
                Add a new user to the platform with specific roles and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-xs font-semibold">Full Name *</Label>
                  <Input
                    id="userName"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userEmail" className="text-xs font-semibold">Email *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="user@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userRole" className="text-xs font-semibold">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value as typeof formData.role })
                    }
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="funder">Funder</SelectItem>
                      <SelectItem value="originator">Originator</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userCompany" className="text-xs font-semibold">Assign to Company *</Label>
                  <Select
                    value={formData.companyId}
                    onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                  >
                    <SelectTrigger className="border-2">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name} ({company.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Permissions</Label>
                <div className="grid grid-cols-2 gap-3 p-4 border-2 border-slate-200 rounded-lg bg-slate-50">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={formData.permissions.includes(permission)}
                        onCheckedChange={() => togglePermission(permission)}
                      />
                      <label
                        htmlFor={permission}
                        className="text-xs font-medium leading-none cursor-pointer capitalize"
                      >
                        {permission.replace(/_/g, ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userStatus" className="text-xs font-semibold">Status</Label>
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
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-slate-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-800 mb-1">{users.length}</div>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Total Users</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-lg">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {['admin', 'funder', 'originator', 'supervisor'].map((role, index) => {
          const Icon = getRoleIcon(role);
          const colors = {
            admin: 'from-purple-500 to-indigo-600',
            funder: 'from-amber-500 to-orange-600',
            originator: 'from-blue-500 to-cyan-600',
            supervisor: 'from-green-500 to-emerald-600',
          };
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
            >
              <Card className="border-2 border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-slate-800 mb-1">
                        {users.filter((u) => u.role === role).length}
                      </div>
                      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider capitalize">{role}s</div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[role as keyof typeof colors]} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Users Table */}
      <Card className="border-2 border-slate-200 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-br from-slate-50 to-white pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UsersIcon className="w-5 h-5 text-slate-700" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">User</TableHead>
                  <TableHead className="font-semibold text-slate-700">Role</TableHead>
                  <TableHead className="font-semibold text-slate-700">Company</TableHead>
                  <TableHead className="font-semibold text-slate-700">Permissions</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const Icon = getRoleIcon(user.role);
                  const roleColors = {
                    admin: 'from-purple-500 to-indigo-600',
                    funder: 'from-amber-500 to-orange-600',
                    originator: 'from-blue-500 to-cyan-600',
                    supervisor: 'from-green-500 to-emerald-600',
                  };
                  return (
                    <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${roleColors[user.role as keyof typeof roleColors]} rounded-lg flex items-center justify-center text-white font-bold shadow-md`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{user.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getRoleColor(user.role)} font-semibold`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm">{user.companyName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.slice(0, 2).map((permission) => (
                            <Badge key={permission} variant="secondary" className="text-[10px]">
                              {permission.split('_')[0]}
                            </Badge>
                          ))}
                          {user.permissions.length > 2 && (
                            <Badge variant="secondary" className="text-[10px]">
                              +{user.permissions.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === 'active'
                              ? 'bg-green-600 text-white border-0 shadow-md'
                              : 'bg-slate-400 text-white border-0'
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          className={`gap-2 hover:bg-slate-100 ${
                            user.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          {user.status === 'active' ? (
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