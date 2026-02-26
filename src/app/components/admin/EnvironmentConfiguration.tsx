import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Plus, Network, Building2, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { EnvironmentDetails } from './EnvironmentDetails';

export function EnvironmentConfiguration() {
  const { environments, companies, addEnvironment, updateEnvironment } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    originatorId: '',
    funderId: '',
    supervisorId: '',
    approvalAuthority: '' as 'funder' | 'supervisor' | '',
    status: 'active' as 'active' | 'inactive',
    approvalLogic: '',
    minLoanAmount: '',
    maxLoanAmount: '',
    documentTypes: [] as Array<{
      name: string;
      description: string;
      required: boolean;
      acceptedFormats: string[];
    }>,
  });

  const funders = companies.filter((c) => c.type === 'funder');
  const originators = companies.filter((c) => c.type === 'originator');
  const supervisors = companies.filter((c) => c.type === 'supervisor');

  // If viewing a specific environment, show details
  if (selectedEnvironmentId) {
    return (
      <EnvironmentDetails
        environmentId={selectedEnvironmentId}
        onBack={() => setSelectedEnvironmentId(null)}
      />
    );
  }

  const addDocumentType = () => {
    setFormData({
      ...formData,
      documentTypes: [
        ...formData.documentTypes,
        {
          name: '',
          description: '',
          required: true,
          acceptedFormats: [],
        },
      ],
    });
  };

  const removeDocumentType = (index: number) => {
    setFormData({
      ...formData,
      documentTypes: formData.documentTypes.filter((_, i) => i !== index),
    });
  };

  const updateDocumentType = (index: number, field: string, value: any) => {
    const updatedDocTypes = [...formData.documentTypes];
    updatedDocTypes[index] = { ...updatedDocTypes[index], [field]: value };
    setFormData({ ...formData, documentTypes: updatedDocTypes });
  };

  const toggleFormat = (docIndex: number, format: string) => {
    const updatedDocTypes = [...formData.documentTypes];
    const formats = updatedDocTypes[docIndex].acceptedFormats;
    updatedDocTypes[docIndex].acceptedFormats = formats.includes(format)
      ? formats.filter(f => f !== format)
      : [...formats, format];
    setFormData({ ...formData, documentTypes: updatedDocTypes });
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.originatorId ||
      !formData.funderId ||
      !formData.supervisorId ||
      !formData.approvalAuthority
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate document types
    const invalidDocTypes = formData.documentTypes.filter(
      dt => !dt.name || !dt.description || dt.acceptedFormats.length === 0
    );
    if (invalidDocTypes.length > 0) {
      toast.error('Please complete all document type fields');
      return;
    }

    const originator = companies.find((c) => c.id === formData.originatorId);
    const funder = companies.find((c) => c.id === formData.funderId);
    const supervisor = companies.find((c) => c.id === formData.supervisorId);

    addEnvironment({
      name: formData.name,
      originatorId: formData.originatorId,
      originatorName: originator?.name || '',
      funderId: formData.funderId,
      funderName: funder?.name || '',
      supervisorId: formData.supervisorId,
      supervisorName: supervisor?.name || '',
      approvalAuthority: formData.approvalAuthority as 'funder' | 'supervisor',
      status: formData.status,
      documentTypes: formData.documentTypes.map((dt, idx) => ({
        id: `dt${idx + 1}`,
        ...dt,
      })),
      dealTerms: {
        approvalLogic: formData.approvalLogic,
        minLoanAmount: formData.minLoanAmount ? parseInt(formData.minLoanAmount) : undefined,
        maxLoanAmount: formData.maxLoanAmount ? parseInt(formData.maxLoanAmount) : undefined,
      },
    });

    toast.success('Environment created successfully');
    setIsDialogOpen(false);
    setFormData({
      name: '',
      originatorId: '',
      funderId: '',
      supervisorId: '',
      approvalAuthority: '',
      status: 'active',
      approvalLogic: '',
      minLoanAmount: '',
      maxLoanAmount: '',
      documentTypes: [],
    });
  };

  const toggleEnvironmentStatus = (id: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateEnvironment(id, { status: newStatus });
    toast.success(`Environment ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Environment Configuration</h2>
            <p className="text-sm text-slate-600">
              Create and manage environments with document requirements
            </p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600">
              <Plus className="w-4 h-4" />
              Create Environment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Environment</DialogTitle>
              <DialogDescription>
                Define the environment's parameters, including document requirements and approval logic.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="envName">Environment Name *</Label>
                <Input
                  id="envName"
                  placeholder="e.g., Global-Premier SME Facility"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originator">Originator *</Label>
                  <Select
                    value={formData.originatorId}
                    onValueChange={(value) => setFormData({ ...formData, originatorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select originator" />
                    </SelectTrigger>
                    <SelectContent>
                      {originators.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="funder">Funder *</Label>
                  <Select
                    value={formData.funderId}
                    onValueChange={(value) => setFormData({ ...formData, funderId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select funder" />
                    </SelectTrigger>
                    <SelectContent>
                      {funders.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor *</Label>
                  <Select
                    value={formData.supervisorId}
                    onValueChange={(value) => setFormData({ ...formData, supervisorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisors.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvalAuthority">Approval Authority *</Label>
                <Select
                  value={formData.approvalAuthority}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      approvalAuthority: value as typeof formData.approvalAuthority,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Who has approval authority?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funder">Funder retains approval rights</SelectItem>
                    <SelectItem value="supervisor">Delegate approval to supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minAmount">Minimum Loan Amount</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    placeholder="e.g., 10000"
                    value={formData.minLoanAmount}
                    onChange={(e) => setFormData({ ...formData, minLoanAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount">Maximum Loan Amount</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    placeholder="e.g., 500000"
                    value={formData.maxLoanAmount}
                    onChange={(e) => setFormData({ ...formData, maxLoanAmount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvalLogic">Approval Logic</Label>
                <Textarea
                  id="approvalLogic"
                  placeholder="Define the approval workflow and conditions..."
                  value={formData.approvalLogic}
                  onChange={(e) => setFormData({ ...formData, approvalLogic: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Document Types Section */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base">Required Documents</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addDocumentType}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Document Type
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.documentTypes.map((docType, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <Input
                              placeholder="Document name (e.g., Business Registration)"
                              value={docType.name}
                              onChange={(e) => updateDocumentType(index, 'name', e.target.value)}
                            />
                            <Textarea
                              placeholder="Description..."
                              value={docType.description}
                              onChange={(e) => updateDocumentType(index, 'description', e.target.value)}
                              rows={2}
                            />
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Required</Label>
                              <Switch
                                checked={docType.required}
                                onCheckedChange={(checked) =>
                                  updateDocumentType(index, 'required', checked)
                                }
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Accepted Formats</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {['PDF', 'JPG', 'PNG', 'DOCX', 'XLSX'].map(format => (
                                  <Badge
                                    key={format}
                                    variant={docType.acceptedFormats.includes(format) ? 'default' : 'outline'}
                                    className="cursor-pointer"
                                    onClick={() => toggleFormat(index, format)}
                                  >
                                    {format}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocumentType(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <ToggleLeft className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full">
                Create Environment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">{environments.length}</div>
              <div className="text-sm text-slate-600">Total Environments</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {environments.filter((e) => e.status === 'active').length}
              </div>
              <div className="text-sm text-slate-600">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">
                {environments.filter((e) => e.approvalAuthority === 'supervisor').length}
              </div>
              <div className="text-sm text-slate-600">Supervisor Delegated</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {environments.map((env) => (
          <Card key={env.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{env.name}</CardTitle>
                    <p className="text-sm text-slate-600">Created: {env.createdAt}</p>
                  </div>
                </div>
                <Badge
                  variant={env.status === 'active' ? 'default' : 'secondary'}
                  className={
                    env.status === 'active'
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : ''
                  }
                >
                  {env.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-600 mb-1">Originator</div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-blue-600" />
                    <span className="text-sm font-medium truncate">{env.originatorName}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Funder</div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-amber-600" />
                    <span className="text-sm font-medium truncate">{env.funderName}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Supervisor</div>
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-green-600" />
                    <span className="text-sm font-medium truncate">{env.supervisorName}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-xs text-slate-600 mb-2">Document Types Required</div>
                <div className="text-2xl font-bold text-purple-600">{env.documentTypes.length}</div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedEnvironmentId(env.id)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEnvironmentStatus(env.id, env.status)}
                >
                  {env.status === 'active' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}