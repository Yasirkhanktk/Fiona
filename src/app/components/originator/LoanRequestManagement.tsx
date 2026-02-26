import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData, UploadedDocument } from '../../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Plus, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Eye,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Download,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { DocumentUploadCard } from '../shared/DocumentUploadCard';
import { motion, AnimatePresence } from 'motion/react';
import { LoanRequestDetailsDialog } from './LoanRequestDetailsDialog';

export function LoanRequestManagement() {
  const { user } = useAuth();
  const { environments, loanRequests, addLoanRequest } = useData();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [step, setStep] = useState<'info' | 'documents'>('info');
  
  const [formData, setFormData] = useState({
    environmentId: '',
    borrowerName: '',
    amount: '',
    currency: 'USD',
    maturityDate: '',
    interestRate: '',
    purpose: '',
  });

  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);

  // Filter environments for the originator's company
  const userEnvironments = environments.filter(
    env => env.originatorId === user?.companyId && env.status === 'active'
  );

  // Get loan requests for this originator
  const userLoanRequests = loanRequests.filter(lr => lr.originatorId === user?.companyId);

  const selectedEnv = environments.find(e => e.id === formData.environmentId);

  const handleFileUpload = (docTypeId: string, docTypeName: string, file: File) => {
    const newDoc: UploadedDocument = {
      id: `doc${Date.now()}`,
      documentTypeId: docTypeId,
      documentTypeName: docTypeName,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      fileUrl: URL.createObjectURL(file),
    };

    setUploadedDocs([...uploadedDocs, newDoc]);
  };

  const handleRemoveDocument = (docId: string) => {
    setUploadedDocs(uploadedDocs.filter(d => d.id !== docId));
  };

  const handleNextToDocuments = () => {
    if (!formData.environmentId || !formData.borrowerName || !formData.amount || !formData.maturityDate || !formData.interestRate || !formData.purpose) {
      toast.error('Please fill all required fields');
      return;
    }
    setStep('documents');
  };

  const handleBackToInfo = () => {
    setStep('info');
  };

  const handleCreateRequest = () => {
    if (!selectedEnv) return;

    // Check if all required documents are uploaded
    const requiredDocs = selectedEnv.documentTypes.filter(dt => dt.required);
    const uploadedDocTypes = new Set(uploadedDocs.map(d => d.documentTypeId));
    const missingDocs = requiredDocs.filter(rd => !uploadedDocTypes.has(rd.id));

    if (missingDocs.length > 0) {
      toast.error(`Missing required documents: ${missingDocs.map(d => d.name).join(', ')}`);
      return;
    }

    const creditId = `CR-${new Date().getFullYear()}-${String(loanRequests.length + 1).padStart(3, '0')}`;

    addLoanRequest({
      creditId,
      environmentId: formData.environmentId,
      environmentName: selectedEnv.name,
      originatorId: user?.companyId || '',
      originatorName: user?.companyName || '',
      borrowerName: formData.borrowerName,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      maturityDate: formData.maturityDate,
      interestRate: parseFloat(formData.interestRate),
      purpose: formData.purpose,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      documents: uploadedDocs,
      reviews: [],
    });

    toast.success('🎉 Loan request submitted successfully!');
    setIsCreateDialogOpen(false);
    setStep('info');
    setFormData({
      environmentId: '',
      borrowerName: '',
      amount: '',
      currency: 'USD',
      maturityDate: '',
      interestRate: '',
      purpose: '',
    });
    setUploadedDocs([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700';
      case 'submitted':
      case 'under_review_supervisor':
      case 'under_review_funder':
        return 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700';
      case 'approved':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700';
      case 'rejected':
        return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700';
      case 'disbursed':
        return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'disbursed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'submitted':
      case 'under_review_supervisor':
      case 'under_review_funder':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'draft':
        return 10;
      case 'submitted':
        return 30;
      case 'under_review_supervisor':
        return 50;
      case 'under_review_funder':
        return 70;
      case 'approved':
        return 90;
      case 'disbursed':
        return 100;
      case 'rejected':
        return 100;
      default:
        return 0;
    }
  };

  const requiredDocsCount = selectedEnv?.documentTypes.filter(dt => dt.required).length || 0;
  const uploadedRequiredDocsCount = uploadedDocs.filter(doc => {
    const docType = selectedEnv?.documentTypes.find(dt => dt.id === doc.documentTypeId);
    return docType?.required;
  }).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Loan Request Management</h2>
            <p className="text-sm text-slate-600">Create and track your loan requests with ease</p>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setStep('info');
            setFormData({
              environmentId: '',
              borrowerName: '',
              amount: '',
              currency: 'USD',
              maturityDate: '',
              interestRate: '',
              purpose: '',
            });
            setUploadedDocs([]);
          }
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
              <Plus className="w-5 h-5" />
              New Loan Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Loan Request</DialogTitle>
              <DialogDescription>
                {step === 'info' 
                  ? 'Fill in the loan details to get started' 
                  : 'Upload the required documents to complete your request'}
              </DialogDescription>
            </DialogHeader>

            {/* Step Indicator */}
            <div className="flex items-center gap-4 py-4">
              <div className={`flex items-center gap-2 ${step === 'info' ? 'text-blue-600' : 'text-green-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === 'info' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                  {step === 'documents' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                </div>
                <span className="font-medium">Loan Details</span>
              </div>
              <div className={`flex-1 h-0.5 ${step === 'documents' ? 'bg-green-600' : 'bg-slate-300'}`} />
              <div className={`flex items-center gap-2 ${step === 'documents' ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step === 'documents' ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                  2
                </div>
                <span className="font-medium">Documents</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 'info' ? (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label className="text-base">Select Environment *</Label>
                    <Select
                      value={formData.environmentId}
                      onValueChange={(value) => {
                        setFormData({ ...formData, environmentId: value });
                        setUploadedDocs([]);
                      }}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choose an environment" />
                      </SelectTrigger>
                      <SelectContent>
                        {userEnvironments.length === 0 ? (
                          <div className="p-4 text-center text-slate-500">
                            No active environments available
                          </div>
                        ) : (
                          userEnvironments.map((env) => (
                            <SelectItem key={env.id} value={env.id}>
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{env.name}</div>
                                <Badge variant="secondary" className="text-xs">
                                  {env.documentTypes.length} docs required
                                </Badge>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {selectedEnv && (
                      <p className="text-sm text-slate-600">
                        Funder: {selectedEnv.funderName} • Supervisor: {selectedEnv.supervisorName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base">Borrower Name *</Label>
                      <Input
                        className="h-12"
                        placeholder="Company or individual name"
                        value={formData.borrowerName}
                        onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base">Loan Amount ({formData.currency}) *</Label>
                      <Input
                        className="h-12"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base">Interest Rate (% APR) *</Label>
                      <Input
                        className="h-12"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 8.5"
                        value={formData.interestRate}
                        onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base">Maturity Date *</Label>
                      <Input
                        className="h-12"
                        type="date"
                        value={formData.maturityDate}
                        onChange={(e) => setFormData({ ...formData, maturityDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base">Purpose of Loan *</Label>
                    <Textarea
                      placeholder="Describe the purpose of this loan in detail..."
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleNextToDocuments}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 gap-2"
                      size="lg"
                    >
                      Continue to Documents
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {selectedEnv && (
                    <>
                      {/* Summary Card */}
                      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-slate-600 mb-1">Borrower</div>
                              <div className="font-semibold">{formData.borrowerName}</div>
                            </div>
                            <div>
                              <div className="text-slate-600 mb-1">Amount</div>
                              <div className="font-semibold">${parseFloat(formData.amount || '0').toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-slate-600 mb-1">Rate</div>
                              <div className="font-semibold">{formData.interestRate}% APR</div>
                            </div>
                            <div>
                              <div className="text-slate-600 mb-1">Documents</div>
                              <div className="font-semibold">{uploadedRequiredDocsCount} of {requiredDocsCount} required</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Document Upload Cards */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">Upload Required Documents</h3>
                          <Badge variant="secondary">
                            {uploadedDocs.length} / {selectedEnv.documentTypes.length} uploaded
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {selectedEnv.documentTypes.map((docType) => {
                            const uploadedDoc = uploadedDocs.find(d => d.documentTypeId === docType.id);
                            return (
                              <DocumentUploadCard
                                key={docType.id}
                                docType={docType}
                                uploadedDoc={uploadedDoc}
                                onUpload={handleFileUpload}
                                onRemove={handleRemoveDocument}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={handleBackToInfo}
                          className="gap-2"
                          size="lg"
                        >
                          <ArrowLeft className="w-5 h-5" />
                          Back to Details
                        </Button>
                        <Button
                          onClick={handleCreateRequest}
                          className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 gap-2"
                          size="lg"
                          disabled={uploadedRequiredDocsCount < requiredDocsCount}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Submit Loan Request
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards with improved design */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', value: userLoanRequests.length, gradient: 'from-slate-500 to-slate-600', icon: FileText },
          { label: 'Under Review', value: userLoanRequests.filter(r => r.status.includes('review')).length, gradient: 'from-amber-500 to-orange-600', icon: Clock },
          { label: 'Approved', value: userLoanRequests.filter(r => r.status === 'approved' || r.status === 'disbursed').length, gradient: 'from-green-500 to-emerald-600', icon: CheckCircle2 },
          { label: 'Rejected', value: userLoanRequests.filter(r => r.status === 'rejected').length, gradient: 'from-red-500 to-rose-600', icon: XCircle },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <CardContent className="pt-6 relative">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-4xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Loan Requests List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-800">Your Loan Requests</h3>
        {userLoanRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-800">{request.borrowerName}</h3>
                        <Badge className={`${getStatusColor(request.status)} px-3 py-1`}>
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(request.status)}
                            <span className="capitalize">{request.status.replace(/_/g, ' ')}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="font-mono font-semibold">{request.creditId}</span>
                        <span>•</span>
                        <span>{request.environmentName}</span>
                        <span>•</span>
                        <span>Submitted {new Date(request.submittedAt || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-800">${request.amount.toLocaleString()}</div>
                      <div className="text-sm text-slate-600">{request.interestRate}% APR</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">Request Progress</span>
                      <span className="font-semibold text-blue-600">{getProgressValue(request.status)}%</span>
                    </div>
                    <Progress value={getProgressValue(request.status)} className="h-3" />
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-600 mb-1">Maturity Date</div>
                      <div className="font-semibold">{new Date(request.maturityDate).toLocaleDateString()}</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-600 mb-1">Documents</div>
                      <div className="font-semibold">{request.documents.length} uploaded</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-600 mb-1">Reviews</div>
                      <div className="font-semibold">{request.reviews.length} comments</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-slate-600 mb-1">Purpose</div>
                      <div className="font-semibold truncate">{request.purpose}</div>
                    </div>
                  </div>

                  {/* Reviews */}
                  {request.reviews.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                        Reviews & Comments
                      </h4>
                      <div className="space-y-2">
                        {request.reviews.map((review) => (
                          <div key={review.id} className="bg-slate-50 rounded-lg p-4 border-l-4 border-l-blue-500">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-slate-800">{review.reviewerName}</span>
                              <Badge
                                variant="outline"
                                className={
                                  review.action === 'approved'
                                    ? 'bg-green-100 text-green-700 border-green-300'
                                    : review.action === 'rejected'
                                    ? 'bg-red-100 text-red-700 border-red-300'
                                    : 'bg-amber-100 text-amber-700 border-amber-300'
                                }
                              >
                                {review.action.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-700 mb-1">{review.comment}</p>
                            <span className="text-xs text-slate-500">
                              {new Date(review.createdAt).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-11"
                      onClick={() => {
                        setSelectedRequestId(request.id);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {userLoanRequests.length === 0 && (
          <Card className="border-2 border-dashed">
            <CardContent className="pt-16 pb-16 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-slate-800">No loan requests yet</h3>
              <p className="text-slate-600 mb-6">Get started by creating your first loan request</p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Create Your First Request
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Loan Request Details Dialog */}
      <LoanRequestDetailsDialog
        open={isViewDialogOpen}
        onOpenChange={(open) => {
          setIsViewDialogOpen(open);
          if (!open) {
            setSelectedRequestId(null);
          }
        }}
        requestId={selectedRequestId}
      />
    </div>
  );
}