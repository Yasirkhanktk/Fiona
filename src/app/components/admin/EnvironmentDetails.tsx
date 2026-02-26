import { useState } from 'react';
import { useData, Environment, DocumentType } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { 
  ArrowLeft, 
  FileText, 
  Plus, 
  Trash2, 
  Building2, 
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  Network
} from 'lucide-react';
import { toast } from 'sonner';

interface EnvironmentDetailsProps {
  environmentId: string;
  onBack: () => void;
}

export function EnvironmentDetails({ environmentId, onBack }: EnvironmentDetailsProps) {
  const { environments, loanRequests, addDocumentTypeToEnvironment, removeDocumentTypeFromEnvironment } = useData();
  const environment = environments.find(e => e.id === environmentId);
  
  const [isAddDocDialogOpen, setIsAddDocDialogOpen] = useState(false);
  const [newDocType, setNewDocType] = useState({
    name: '',
    description: '',
    required: true,
    acceptedFormats: [] as string[],
  });

  if (!environment) {
    return <div>Environment not found</div>;
  }

  const envLoanRequests = loanRequests.filter(lr => lr.environmentId === environmentId);
  const pendingRequests = envLoanRequests.filter(lr => 
    lr.status === 'submitted' || lr.status === 'under_review_supervisor' || lr.status === 'under_review_funder'
  );
  const approvedRequests = envLoanRequests.filter(lr => lr.status === 'approved' || lr.status === 'disbursed');
  const rejectedRequests = envLoanRequests.filter(lr => lr.status === 'rejected');

  const handleAddDocumentType = () => {
    if (!newDocType.name || !newDocType.description || newDocType.acceptedFormats.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    addDocumentTypeToEnvironment(environmentId, newDocType);
    toast.success('Document type added successfully');
    setIsAddDocDialogOpen(false);
    setNewDocType({
      name: '',
      description: '',
      required: true,
      acceptedFormats: [],
    });
  };

  const handleRemoveDocumentType = (docTypeId: string) => {
    removeDocumentTypeFromEnvironment(environmentId, docTypeId);
    toast.success('Document type removed');
  };

  const toggleFormat = (format: string) => {
    setNewDocType(prev => ({
      ...prev,
      acceptedFormats: prev.acceptedFormats.includes(format)
        ? prev.acceptedFormats.filter(f => f !== format)
        : [...prev.acceptedFormats, format],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Network className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{environment.name}</h2>
            <p className="text-sm text-slate-600">Environment Dashboard & Management</p>
          </div>
        </div>
        <Badge
          variant={environment.status === 'active' ? 'default' : 'secondary'}
          className={environment.status === 'active' ? 'bg-green-600 text-white border-0 shadow-md text-sm px-4 py-1' : 'text-sm px-4 py-1'}
        >
          {environment.status}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{envLoanRequests.length}</div>
                <div className="text-sm text-slate-600">Total Requests</div>
              </div>
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-600">{pendingRequests.length}</div>
                <div className="text-sm text-slate-600">Under Review</div>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{approvedRequests.length}</div>
                <div className="text-sm text-slate-600">Approved</div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{rejectedRequests.length}</div>
                <div className="text-sm text-slate-600">Rejected</div>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Originator</div>
              <div className="flex items-center gap-2 text-blue-600">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{environment.originatorName}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Funder</div>
              <div className="flex items-center gap-2 text-amber-600">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{environment.funderName}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Supervisor</div>
              <div className="flex items-center gap-2 text-green-600">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{environment.supervisorName}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Approval Authority</div>
              <Badge
                variant="outline"
                className={
                  environment.approvalAuthority === 'supervisor'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }
              >
                {environment.approvalAuthority === 'supervisor'
                  ? 'Delegated to Supervisor'
                  : 'Retained by Funder'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Deal Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Loan Amount Range</div>
              <div className="text-lg font-semibold">
                ${environment.dealTerms.minLoanAmount?.toLocaleString() || '0'} - ${environment.dealTerms.maxLoanAmount?.toLocaleString() || 'Unlimited'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Approval Logic</div>
              <p className="text-sm text-slate-700">{environment.dealTerms.approvalLogic}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Types */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Required Document Types ({environment.documentTypes.length})
            </CardTitle>
            <Dialog open={isAddDocDialogOpen} onOpenChange={setIsAddDocDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600">
                  <Plus className="w-4 h-4" />
                  Add Document Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Document Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Document Name *</Label>
                    <Input
                      placeholder="e.g., Tax Returns"
                      value={newDocType.name}
                      onChange={(e) => setNewDocType({ ...newDocType, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea
                      placeholder="Describe what this document should contain..."
                      value={newDocType.description}
                      onChange={(e) => setNewDocType({ ...newDocType, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Required Document</Label>
                    <Switch
                      checked={newDocType.required}
                      onCheckedChange={(checked) => setNewDocType({ ...newDocType, required: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Accepted Formats *</Label>
                    <div className="flex flex-wrap gap-2">
                      {['PDF', 'JPG', 'PNG', 'DOCX', 'XLSX'].map(format => (
                        <Badge
                          key={format}
                          variant={newDocType.acceptedFormats.includes(format) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleFormat(format)}
                        >
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleAddDocumentType} className="w-full">
                    Add Document Type
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {environment.documentTypes.map((docType) => (
              <Card key={docType.id} className="overflow-hidden">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{docType.name}</h4>
                        {docType.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{docType.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {docType.acceptedFormats.map((format, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {format}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDocumentType(docType.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Loan Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Loan Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {envLoanRequests.slice(0, 5).map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{request.borrowerName}</div>
                      <div className="text-sm text-slate-600">{request.creditId}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${request.amount.toLocaleString()}</div>
                      <Badge
                        variant="outline"
                        className={
                          request.status === 'approved' || request.status === 'disbursed'
                            ? 'bg-green-100 text-green-700'
                            : request.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        }
                      >
                        {request.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {envLoanRequests.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No loan requests yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}