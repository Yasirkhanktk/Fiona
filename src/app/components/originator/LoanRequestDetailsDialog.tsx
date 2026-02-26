import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { FileText, X, Eye, ChevronDown, ChevronUp, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useState } from 'react';

interface LoanRequestDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string | null;
}

export function LoanRequestDetailsDialog({ open, onOpenChange, requestId }: LoanRequestDetailsDialogProps) {
  const { loanRequests } = useData();
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());
  
  const request = requestId ? loanRequests.find(r => r.id === requestId) : null;
  
  const toggleDoc = (docId: string) => {
    const newExpanded = new Set(expandedDocs);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedDocs(newExpanded);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'submitted':
      case 'under_review_supervisor':
      case 'under_review_funder':
        return 'bg-amber-100 text-amber-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'disbursed':
        return 'bg-blue-100 text-blue-700';
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

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1300px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Loan Request Details - {request.creditId}</DialogTitle>
          <DialogDescription>
            View complete details for loan request {request.creditId} including borrower information, documents, and reviews.
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Loan Request Details</h2>
              <p className="text-sm text-slate-600 mt-0.5">Credit ID: {request.creditId}</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-9 h-9 rounded-full hover:bg-white/50 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="space-y-7">
            {/* Key Information Row - Card Layout */}
            <div className="grid grid-cols-4 gap-5">
              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="text-xs text-slate-500 mb-3 font-medium">Loan Amount</div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600" />
                    <span className="font-bold text-2xl text-slate-800">${request.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-slate-600 font-medium">{request.currency}</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="text-xs text-slate-500 mb-3 font-medium">Interest Rate</div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600" />
                    <span className="font-bold text-2xl text-slate-800">{request.interestRate}%</span>
                  </div>
                  <div className="text-sm text-slate-600 font-medium">APR</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="text-xs text-slate-500 mb-3 font-medium">Borrower</div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-500 to-emerald-600" />
                    <span className="font-bold text-base text-slate-800 leading-tight">{request.borrowerName}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="text-xs text-slate-500 mb-3 font-medium">Maturity Date</div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-500 to-orange-600" />
                    <span className="font-bold text-base text-slate-800">
                      {new Date(request.maturityDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Section */}
            <Card className="bg-slate-50 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-base text-slate-800">Request Status</span>
                  </div>
                  <Badge className={`${getStatusColor(request.status)} px-4 py-1.5 flex items-center gap-2`}>
                    {getStatusIcon(request.status)}
                    <span className="capitalize text-sm font-semibold">{request.status.replace(/_/g, ' ')}</span>
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Progress</span>
                    <span className="font-semibold text-blue-600">{getProgressValue(request.status)}%</span>
                  </div>
                  <Progress value={getProgressValue(request.status)} className="h-2.5" />
                </div>
              </CardContent>
            </Card>

            {/* Loan Purpose */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-800">Loan Purpose</h3>
              </div>
              <Card className="bg-white shadow-sm">
                <CardContent className="p-5">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {request.purpose}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-800">Additional Information</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-5">
                    <div className="text-xs text-slate-500 mb-2 font-medium">Environment</div>
                    <div className="font-semibold text-base text-slate-800">{request.environmentName}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white shadow-sm">
                  <CardContent className="p-5">
                    <div className="text-xs text-slate-500 mb-2 font-medium">Submitted Date</div>
                    <div className="font-semibold text-base text-slate-800">
                      {new Date(request.submittedAt || '').toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Overall Reviews */}
            {request.reviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-base text-slate-800">Overall Reviews</h3>
                  </div>
                  <Badge variant="secondary" className="text-sm px-3 py-1">{request.reviews.length}</Badge>
                </div>
                <Card className="bg-blue-50 border-blue-200 shadow-sm">
                  <CardContent className="p-5">
                    {request.reviews.map((review) => (
                      <div key={review.id} className="mb-5 last:mb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-semibold text-base text-slate-800">{review.reviewerName}</div>
                            <div className="text-xs text-slate-600 capitalize mt-1">
                              {review.reviewerRole} • {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge
                            className={
                              review.action === 'approved'
                                ? 'bg-green-500 text-white'
                                : review.action === 'rejected'
                                ? 'bg-red-500 text-white'
                                : 'bg-amber-500 text-white'
                            }
                          >
                            {review.action.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Review Documents */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base text-slate-800">Documents</h3>
                </div>
                <span className="text-sm text-slate-600 font-medium">( {request.documents.length} )</span>
              </div>

              <div className="space-y-4">
                {request.documents.map((doc) => {
                  const isExpanded = expandedDocs.has(doc.id);
                  const docReviews = doc.reviews || [];

                  return (
                    <Card key={doc.id} className="bg-blue-50 border-blue-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        {/* Document Header */}
                        <div className="flex items-center justify-between p-5">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-md">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-base text-slate-800 mb-1">{doc.documentTypeName}</div>
                              <div className="text-sm text-slate-600 truncate">{doc.fileName}</div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDoc(doc.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </Button>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="border-t border-blue-200 bg-white p-5">
                            <div className="flex items-center justify-center py-10 mb-5 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                              <button
                                onClick={() => window.open(doc.fileUrl, '_blank')}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                              >
                                <Eye className="w-5 h-5" />
                                <span className="text-base">View Document</span>
                              </button>
                            </div>

                            {/* Document Reviews */}
                            {docReviews.length > 0 && (
                              <div className="space-y-3">
                                <div className="text-xs font-bold text-slate-600 uppercase mb-3">Document Reviews</div>
                                {docReviews.map((review, idx) => (
                                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border-l-4 border-blue-500">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-semibold text-slate-800">
                                        {review.reviewerName} <span className="text-slate-500 font-normal">({review.reviewerRole})</span>
                                      </span>
                                      <Badge
                                        className={
                                          review.status === 'approved'
                                            ? 'bg-green-500 text-white text-xs'
                                            : 'bg-red-500 text-white text-xs'
                                        }
                                      >
                                        {review.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t bg-slate-50">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full h-11 text-base font-semibold"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}