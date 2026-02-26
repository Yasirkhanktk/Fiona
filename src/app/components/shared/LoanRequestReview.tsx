import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData, type UploadedDocument } from '../../contexts/DataContext';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ThumbsUp,
  ThumbsDown,
  Eye,
  TrendingUp,
  Building2,
  AlertCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function LoanRequestReview() {
  const { user } = useAuth();
  const { loanRequests, environments, updateLoanRequest, addReviewToLoanRequest, addDocumentReview } = useData();
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [overallComment, setOverallComment] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [documentReviews, setDocumentReviews] = useState<Record<string, { status: 'approved' | 'rejected', comment: string }>>({});

  const isSupervisor = user?.role === 'supervisor';
  const isFunder = user?.role === 'funder';

  // Filter requests based on role
  const relevantRequests = loanRequests.filter(lr => {
    const env = environments.find(e => e.id === lr.environmentId);
    if (!env) return false;

    if (isSupervisor) {
      return env.supervisorId === user?.companyId;
    } else if (isFunder) {
      return env.funderId === user?.companyId;
    }
    return false;
  });

  const pendingRequests = relevantRequests.filter(lr => {
    if (isSupervisor) {
      return lr.status === 'submitted' || lr.status === 'under_review_supervisor';
    } else if (isFunder) {
      return lr.status === 'under_review_funder';
    }
    return false;
  });

  const reviewedRequests = relevantRequests.filter(lr => {
    return lr.reviews.some(r => r.reviewerId === user?.id) || 
           lr.status === 'approved' || 
           lr.status === 'rejected' ||
           lr.status === 'disbursed';
  });

  const selectedRequest = loanRequests.find(r => r.id === selectedRequestId);

  const handleOpenReview = (requestId: string) => {
    setSelectedRequestId(requestId);
    setOverallComment('');
    setDocumentReviews({});
    setIsReviewDialogOpen(true);
  };

  const handleDocumentReview = (docId: string, status: 'approved' | 'rejected', comment: string) => {
    setDocumentReviews(prev => ({
      ...prev,
      [docId]: { status, comment }
    }));
  };

  const handleSubmitReview = (action: 'approved' | 'rejected') => {
    if (!selectedRequest) return;

    // Check if all documents are reviewed
    const allDocsReviewed = selectedRequest.documents.every(doc => documentReviews[doc.id]);
    if (!allDocsReviewed) {
      toast.error('Please review all documents before submitting');
      return;
    }

    // If approving, check all docs are approved
    if (action === 'approved') {
      const hasRejectedDocs = Object.values(documentReviews).some(r => r.status === 'rejected');
      if (hasRejectedDocs) {
        toast.error('Cannot approve: Some documents are rejected');
        return;
      }
    }

    // Add document reviews
    Object.entries(documentReviews).forEach(([docId, review]) => {
      addDocumentReview(selectedRequest.id, docId, {
        reviewerId: user?.id || '',
        reviewerName: user?.name || '',
        reviewerRole: user?.role === 'supervisor' ? 'supervisor' : 'funder',
        status: review.status,
        comment: review.comment,
      });
    });

    // Add overall review
    const finalComment = overallComment.trim() || `Request ${action}`;
    addReviewToLoanRequest(selectedRequest.id, {
      reviewerId: user?.id || '',
      reviewerName: user?.name || '',
      reviewerRole: user?.role === 'supervisor' ? 'supervisor' : 'funder',
      comment: finalComment,
      action: action,
    });

    // Update request status
    let newStatus = selectedRequest.status;
    if (action === 'approved') {
      if (isSupervisor) {
        const env = environments.find(e => e.id === selectedRequest.environmentId);
        if (env?.approvalAuthority === 'supervisor') {
          newStatus = 'approved';
        } else {
          newStatus = 'under_review_funder';
        }
      } else if (isFunder) {
        newStatus = 'approved';
      }
    } else {
      newStatus = 'rejected';
    }

    updateLoanRequest(selectedRequest.id, { status: newStatus });

    toast.success(
      action === 'approved' 
        ? '✅ Request approved successfully!' 
        : '❌ Request rejected'
    );
    
    setIsReviewDialogOpen(false);
    setDocumentReviews({});
    setOverallComment('');
    setSelectedRequestId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const roleColor = isSupervisor 
    ? 'from-green-600 to-emerald-600' 
    : 'from-amber-600 to-orange-600';
  
  const roleIcon = isSupervisor ? Building2 : TrendingUp;
  const RoleIcon = roleIcon;

  const reviewedDocsCount = selectedRequest ? Object.keys(documentReviews).length : 0;
  const totalDocsCount = selectedRequest?.documents.length || 0;
  const approvedDocsCount = Object.values(documentReviews).filter(r => r.status === 'approved').length;
  const rejectedDocsCount = Object.values(documentReviews).filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${roleColor} flex items-center justify-center shadow-lg`}>
          <RoleIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isSupervisor ? 'Request Validation' : 'Approval Management'}
          </h2>
          <p className="text-sm text-slate-600">
            {isSupervisor 
              ? 'Review and validate loan requests from originators' 
              : 'Review and approve loan requests for funding'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Requests', value: relevantRequests.length, gradient: 'from-slate-500 to-slate-600', icon: FileText },
          { label: 'Pending Review', value: pendingRequests.length, gradient: 'from-amber-500 to-orange-600', icon: Clock },
          { label: 'Approved', value: relevantRequests.filter(r => r.status === 'approved' || r.status === 'disbursed').length, gradient: 'from-green-500 to-emerald-600', icon: CheckCircle2 },
          { label: 'Rejected', value: relevantRequests.filter(r => r.status === 'rejected').length, gradient: 'from-red-500 to-rose-600', icon: XCircle },
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pending' | 'reviewed')}>
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="w-4 h-4" />
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="reviewed" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Reviewed ({reviewedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingRequests.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-16 pb-16 text-center">
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${roleColor} opacity-10 flex items-center justify-center mx-auto mb-6`}>
                  <CheckCircle2 className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-slate-800">All caught up!</h3>
                <p className="text-slate-600">No pending requests to review at the moment</p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-amber-500">
                  <CardContent className="pt-6">
                    <div className="space-y-5">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-slate-800">{request.borrowerName}</h3>
                            <Badge className={`${getStatusColor(request.status)} px-3 py-1`}>
                              <span className="capitalize">{request.status.replace(/_/g, ' ')}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="font-mono font-semibold">{request.creditId}</span>
                            <span>•</span>
                            <span>{request.environmentName}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-slate-800">${request.amount.toLocaleString()}</div>
                          <div className="text-sm text-slate-600">{request.interestRate}% APR</div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-slate-600 mb-1">Purpose</div>
                          <div className="font-semibold line-clamp-2">{request.purpose}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-slate-600 mb-1">Maturity</div>
                          <div className="font-semibold">{new Date(request.maturityDate).toLocaleDateString()}</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="text-slate-600 mb-1">Documents</div>
                          <div className="font-semibold">{request.documents.length} files</div>
                        </div>
                      </div>

                      {/* Review Button */}
                      <Button
                        onClick={() => handleOpenReview(request.id)}
                        className={`w-full h-12 bg-gradient-to-r ${roleColor} gap-2 shadow-lg`}
                        size="lg"
                      >
                        <Eye className="w-5 h-5" />
                        Review Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-3 mt-6">
          {reviewedRequests.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No reviewed requests yet</p>
              </CardContent>
            </Card>
          ) : (
            reviewedRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{request.borrowerName}</h4>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">{request.creditId}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">${request.amount.toLocaleString()}</div>
                      <div className="text-xs text-slate-600">{request.reviews.length} reviews</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${roleColor} flex items-center justify-center`}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span>Review Loan Request</span>
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReviewDialogOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedRequest && (
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Request Summary */}
                <div className="grid grid-cols-4 gap-4">
                  <Card className="bg-slate-50">
                    <CardContent className="pt-4">
                      <div className="text-xs text-slate-600 mb-1">Borrower</div>
                      <div className="font-bold text-lg">{selectedRequest.borrowerName}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50">
                    <CardContent className="pt-4">
                      <div className="text-xs text-slate-600 mb-1">Amount</div>
                      <div className="font-bold text-lg">${selectedRequest.amount.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50">
                    <CardContent className="pt-4">
                      <div className="text-xs text-slate-600 mb-1">Interest Rate</div>
                      <div className="font-bold text-lg">{selectedRequest.interestRate}%</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50">
                    <CardContent className="pt-4">
                      <div className="text-xs text-slate-600 mb-1">Maturity</div>
                      <div className="font-bold text-sm">{new Date(selectedRequest.maturityDate).toLocaleDateString()}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Review Progress */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Review Progress
                      </h3>
                      <Badge variant="outline" className="bg-white">
                        {reviewedDocsCount} / {totalDocsCount}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Documents Reviewed</span>
                        <span className="font-semibold">{reviewedDocsCount} of {totalDocsCount}</span>
                      </div>
                      {reviewedDocsCount > 0 && (
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 font-semibold">{approvedDocsCount} Approved</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span className="text-red-700 font-semibold">{rejectedDocsCount} Rejected</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Documents */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Documents ({selectedRequest.documents.length})</h3>
                  <div className="space-y-3">
                    {selectedRequest.documents.map((doc) => (
                      <DocumentReviewCard
                        key={doc.id}
                        document={doc}
                        review={documentReviews[doc.id]}
                        onReview={(status, comment) => handleDocumentReview(doc.id, status, comment)}
                      />
                    ))}
                  </div>
                </div>

                {/* Validation Alert */}
                {rejectedDocsCount > 0 && (
                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <div className="font-semibold mb-1">Warning</div>
                          <div>You have rejected {rejectedDocsCount} document(s). You can only approve this request if all documents are approved.</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Overall Comment */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Overall Review Comment (Optional)</Label>
                  <Textarea
                    placeholder="Add any general comments or conditions about the entire loan request..."
                    value={overallComment}
                    onChange={(e) => setOverallComment(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex-shrink-0 px-6 py-4 border-t bg-slate-50 space-y-2">
            <div className="flex gap-3">
              <Button
                onClick={() => handleSubmitReview('approved')}
                className={`flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg`}
                size="lg"
                disabled={reviewedDocsCount !== totalDocsCount || rejectedDocsCount > 0}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Confirm Approval
              </Button>
              <Button
                onClick={() => handleSubmitReview('rejected')}
                variant="destructive"
                className="flex-1 h-12 shadow-lg"
                size="lg"
                disabled={reviewedDocsCount === 0}
              >
                <XCircle className="w-5 h-5 mr-2" />
                Reject Request
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocumentReviewCard({
  document,
  review,
  onReview,
}: {
  document: UploadedDocument;
  review?: { status: 'approved' | 'rejected'; comment: string };
  onReview: (status: 'approved' | 'rejected', comment: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState<'approved' | 'rejected'>(review?.status || 'approved');
  const [comment, setComment] = useState(review?.comment || '');

  const handleSave = () => {
    if (!comment.trim()) {
      toast.error('Please provide a comment');
      return;
    }
    onReview(status, comment);
    setIsExpanded(false);
    toast.success(`Document ${status}`);
  };

  if (review) {
    return (
      <Card className={review.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            {review.status === 'approved' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold mb-1">{document.documentTypeName}</div>
                  <div className="text-xs text-slate-600">{document.fileName}</div>
                </div>
                <Badge className={review.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                  {review.status}
                </Badge>
              </div>
              <div className="text-sm bg-white p-3 rounded border">
                {review.comment}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatus(review.status);
                  setComment(review.comment);
                  setIsExpanded(true);
                }}
                className="mt-2"
              >
                Edit Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 hover:border-blue-300 transition-colors">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3 mb-3">
          <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold mb-1">{document.documentTypeName}</div>
            <div className="text-xs text-slate-600">{document.fileName}</div>
          </div>
        </div>

        {isExpanded ? (
          <div className="space-y-3 border-t pt-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={status === 'approved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus('approved')}
                className={status === 'approved' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : ''}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                variant={status === 'rejected' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus('rejected')}
                className={status === 'rejected' ? 'bg-gradient-to-r from-red-600 to-rose-600' : ''}
              >
                <ThumbsDown className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
            <Textarea
              placeholder={status === 'approved' ? 'Document verified and meets all requirements...' : 'Specify issues or missing information...'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="flex-1">
                Save Review
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="w-full"
          >
            <Eye className="w-4 h-4 mr-2" />
            Review Document
          </Button>
        )}
      </CardContent>
    </Card>
  );
}