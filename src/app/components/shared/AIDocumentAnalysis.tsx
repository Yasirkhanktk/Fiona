import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  FileCheck,
  Loader2,
  Info,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  User,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import type { UploadedDocument } from '../../contexts/DataContext';

interface AIAnalysisResult {
  documentId: string;
  overallScore: number; // 0-100
  status: 'verified' | 'warning' | 'rejected';
  findings: {
    type: 'positive' | 'warning' | 'critical';
    category: string;
    message: string;
  }[];
  missingFields: string[];
  recommendations: string[];
}

interface AIDocumentAnalysisProps {
  documents: UploadedDocument[];
  onAnalysisComplete?: (results: AIAnalysisResult[]) => void;
  onDocumentReview?: (docId: string, status: 'approved' | 'rejected', comment: string) => void;
  existingReviews?: Record<string, { status: 'approved' | 'rejected', comment: string }>;
  userRole?: 'supervisor' | 'funder';
}

export function AIDocumentAnalysis({ documents, onAnalysisComplete, onDocumentReview, existingReviews = {}, userRole }: AIDocumentAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AIAnalysisResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [documentComments, setDocumentComments] = useState<Record<string, string>>({});
  const [showCommentBox, setShowCommentBox] = useState<Record<string, boolean>>({});

  const handleDocumentAction = (documentId: string, status: 'approved' | 'rejected', documentName: string) => {
    const comment = documentComments[documentId] || '';
    onDocumentReview?.(documentId, status, comment);
    
    // Clear comment after submission
    setDocumentComments(prev => {
      const newComments = { ...prev };
      delete newComments[documentId];
      return newComments;
    });

    // Show success toast
    toast.success(
      status === 'approved' 
        ? `✅ ${documentName} approved successfully!` 
        : `❌ ${documentName} rejected`,
      { 
        description: comment ? `Comment: ${comment.substring(0, 60)}${comment.length > 60 ? '...' : ''}` : undefined
      }
    );
  };

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    setShowResults(false);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Generate mock AI analysis results
    const results: AIAnalysisResult[] = documents.map((doc) => {
      const score = Math.floor(Math.random() * 30) + 70; // 70-100
      const hasWarnings = score < 85;
      const hasCritical = score < 75;

      const findings = [];
      const missingFields = [];
      const recommendations = [];

      // Positive findings
      if (score >= 90) {
        findings.push({
          type: 'positive' as const,
          category: 'Document Quality',
          message: 'Document is clear, legible, and properly formatted'
        });
        findings.push({
          type: 'positive' as const,
          category: 'Data Completeness',
          message: 'All required fields and signatures are present'
        });
      }

      if (score >= 85) {
        findings.push({
          type: 'positive' as const,
          category: 'Verification',
          message: 'Document metadata matches expected format'
        });
      }

      // Warnings
      if (hasWarnings) {
        findings.push({
          type: 'warning' as const,
          category: 'Date Verification',
          message: 'Document date is older than 90 days - may require renewal'
        });
        missingFields.push('Recent date verification');
        recommendations.push('Consider requesting an updated version of this document');
      }

      if (score < 80) {
        findings.push({
          type: 'warning' as const,
          category: 'Image Quality',
          message: 'Some sections appear low resolution or partially obscured'
        });
        recommendations.push('Request higher quality scan if possible');
      }

      // Critical issues
      if (hasCritical) {
        findings.push({
          type: 'critical' as const,
          category: 'Missing Information',
          message: 'Signature or stamp appears to be missing or unclear'
        });
        missingFields.push('Clear signature/authorization');
        recommendations.push('Require borrower to provide properly signed document');
      }

      // Specific document type checks
      if (doc.documentTypeName.toLowerCase().includes('id')) {
        findings.push({
          type: 'positive' as const,
          category: 'Identity Verification',
          message: 'Photo and personal details are clearly visible'
        });
        if (score < 85) {
          findings.push({
            type: 'warning' as const,
            category: 'Expiry Date',
            message: 'Unable to verify document expiry date'
          });
        }
      }

      if (doc.documentTypeName.toLowerCase().includes('bank') || 
          doc.documentTypeName.toLowerCase().includes('statement')) {
        findings.push({
          type: 'positive' as const,
          category: 'Financial Data',
          message: 'Account numbers and transaction history are visible'
        });
        if (score < 90) {
          findings.push({
            type: 'warning' as const,
            category: 'Statement Period',
            message: 'Statement period verification required'
          });
        }
      }

      return {
        documentId: doc.id,
        overallScore: score,
        status: hasCritical ? 'rejected' : hasWarnings ? 'warning' : 'verified',
        findings,
        missingFields,
        recommendations
      };
    });

    setAnalysisResults(results);
    setIsAnalyzing(false);
    setShowResults(true);
    onAnalysisComplete?.(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'warning':
        return 'from-amber-50 to-orange-50 border-amber-200';
      case 'rejected':
        return 'from-red-50 to-rose-50 border-red-200';
      default:
        return 'from-slate-50 to-slate-100 border-slate-200';
    }
  };

  const overallScore = analysisResults.length > 0
    ? Math.round(analysisResults.reduce((sum, r) => sum + r.overallScore, 0) / analysisResults.length)
    : 0;

  const verifiedCount = analysisResults.filter(r => r.status === 'verified').length;
  const warningCount = analysisResults.filter(r => r.status === 'warning').length;
  const rejectedCount = analysisResults.filter(r => r.status === 'rejected').length;

  return (
    <div className="space-y-4">
      {/* AI Analysis Header Card */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                  AI Document Analysis
                  <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    Beta
                  </Badge>
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Advanced AI-powered verification checks document authenticity, completeness, and compliance requirements
                </p>

                {!showResults && !isAnalyzing && (
                  <Button
                    onClick={runAIAnalysis}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze {documents.length} Document{documents.length !== 1 ? 's' : ''}
                  </Button>
                )}

                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 text-purple-700"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <div>
                      <div className="font-semibold">Analyzing documents...</div>
                      <div className="text-xs text-slate-600">AI is scanning for completeness, authenticity, and compliance</div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Overall Results Summary */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-purple-200"
              >
                <div className="grid grid-cols-4 gap-4">
                  {/* Overall Score */}
                  <Card className="bg-white border-2">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <div className="text-xs text-slate-600 font-semibold">Overall Score</div>
                      </div>
                      <div className="text-3xl font-bold text-purple-700">{overallScore}%</div>
                    </CardContent>
                  </Card>

                  {/* Verified */}
                  <Card className="bg-white border-2">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <div className="text-xs text-slate-600 font-semibold">Verified</div>
                      </div>
                      <div className="text-3xl font-bold text-green-700">{verifiedCount}</div>
                    </CardContent>
                  </Card>

                  {/* Warnings */}
                  <Card className="bg-white border-2">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <div className="text-xs text-slate-600 font-semibold">Warnings</div>
                      </div>
                      <div className="text-3xl font-bold text-amber-700">{warningCount}</div>
                    </CardContent>
                  </Card>

                  {/* Issues */}
                  <Card className="bg-white border-2">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <div className="text-xs text-slate-600 font-semibold">Critical Issues</div>
                      </div>
                      <div className="text-3xl font-bold text-red-700">{rejectedCount}</div>
                    </CardContent>
                  </Card>
                </div>

                <Button
                  onClick={runAIAnalysis}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  Re-analyze
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Individual Document Results */}
      <AnimatePresence>
        {showResults && analysisResults.map((result, index) => {
          const document = documents.find(d => d.id === result.documentId);
          if (!document) return null;

          return (
            <motion.div
              key={result.documentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-2 bg-gradient-to-br ${getStatusColor(result.status)}`}>
                <CardContent className="pt-5">
                  {/* Document Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(result.status)}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 mb-1">{document.documentTypeName}</div>
                        <div className="text-xs text-slate-600">{document.fileName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800">{result.overallScore}%</div>
                      <Badge 
                        className={
                          result.status === 'verified' 
                            ? 'bg-green-100 text-green-700 border-green-300' 
                            : result.status === 'warning'
                            ? 'bg-amber-100 text-amber-700 border-amber-300'
                            : 'bg-red-100 text-red-700 border-red-300'
                        }
                      >
                        {result.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Findings */}
                  <div className="space-y-2">
                    {result.findings.map((finding, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 p-2 rounded-lg bg-white/50 text-sm ${
                          finding.type === 'positive' 
                            ? 'border-l-2 border-green-500' 
                            : finding.type === 'warning'
                            ? 'border-l-2 border-amber-500'
                            : 'border-l-2 border-red-500'
                        }`}
                      >
                        {finding.type === 'positive' && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />}
                        {finding.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />}
                        {finding.type === 'critical' && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
                        <div className="flex-1">
                          <div className="font-semibold text-xs text-slate-700 mb-0.5">{finding.category}</div>
                          <div className="text-slate-600">{finding.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Missing Fields */}
                  {result.missingFields.length > 0 && (
                    <div className="mt-3 p-3 bg-white rounded-lg border-2 border-amber-300">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-xs text-amber-800 mb-1">Missing or Unclear:</div>
                          <div className="text-xs text-amber-700">
                            {result.missingFields.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className="mt-3 p-3 bg-white rounded-lg">
                      <div className="flex items-start gap-2">
                        <FileCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-xs text-slate-700 mb-1">AI Recommendations:</div>
                          <ul className="text-xs text-slate-600 space-y-1">
                            {result.recommendations.map((rec, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="text-blue-600">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Previous Reviews - Show supervisor reviews to funders */}
                  {document.reviews && document.reviews.length > 0 && userRole === 'funder' && (() => {
                    const supervisorReviews = document.reviews.filter(r => r.reviewerRole === 'supervisor');
                    return supervisorReviews.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        <div className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Previous Reviews ({supervisorReviews.length})
                        </div>
                        {supervisorReviews.map((review, reviewIdx) => (
                          <div 
                            key={reviewIdx}
                            className={`p-3 rounded-lg border-2 ${
                              review.status === 'approved'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {review.status === 'approved' ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <div>
                                  <div className="text-xs font-bold text-slate-800">
                                    {review.reviewerName}
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs mt-1 bg-white"
                                  >
                                    {review.reviewerRole === 'supervisor' ? '🛡️ Supervisor' : '💰 Funder'}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  className={`text-xs ${
                                    review.status === 'approved'
                                      ? 'bg-green-600 text-white'
                                      : 'bg-red-600 text-white'
                                  }`}
                                >
                                  {review.status === 'approved' ? 'Approved' : 'Rejected'}
                                </Badge>
                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(review.reviewedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {review.comment && (
                              <div className="mt-2 p-2 bg-white/70 rounded text-xs text-slate-700">
                                <span className="font-semibold">Comment:</span> {review.comment}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}

                  {/* Previous Reviews - Show funder reviews to supervisors */}
                  {document.reviews && document.reviews.length > 0 && userRole === 'supervisor' && (() => {
                    const funderReviews = document.reviews.filter(r => r.reviewerRole === 'funder');
                    return funderReviews.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        <div className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Funder Reviews ({funderReviews.length})
                        </div>
                        {funderReviews.map((review, reviewIdx) => (
                          <div 
                            key={reviewIdx}
                            className={`p-3 rounded-lg border-2 ${
                              review.status === 'approved'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {review.status === 'approved' ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                                <div>
                                  <div className="text-xs font-bold text-slate-800">
                                    {review.reviewerName}
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs mt-1 bg-white"
                                  >
                                    💰 Funder
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge
                                  className={`text-xs ${
                                    review.status === 'approved'
                                      ? 'bg-green-600 text-white'
                                      : 'bg-red-600 text-white'
                                  }`}
                                >
                                  {review.status === 'approved' ? 'Approved' : 'Rejected'}
                                </Badge>
                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(review.reviewedAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            {review.comment && (
                              <div className="mt-2 p-2 bg-white/70 rounded text-xs text-slate-700">
                                <span className="font-semibold">Comment:</span> {review.comment}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null;
                  })()}

                  {/* Action Panel - Only show if onDocumentReview callback is provided */}
                  {onDocumentReview && (
                    <div className="mt-5 pt-5 border-t-2 border-white/50">
                      {existingReviews[result.documentId] ? (
                        /* Show existing review status */
                        <div
                          className={`p-4 rounded-lg ${
                            existingReviews[result.documentId].status === 'approved'
                              ? 'bg-green-100 border-2 border-green-300'
                              : 'bg-red-100 border-2 border-red-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {existingReviews[result.documentId].status === 'approved' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-700" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-700" />
                            )}
                            <span className="font-bold text-sm">
                              Document {existingReviews[result.documentId].status === 'approved' ? 'Approved' : 'Rejected'}
                            </span>
                          </div>
                          {existingReviews[result.documentId].comment && (
                            <div className="text-sm text-slate-700 mt-2 pl-7">
                              <span className="font-semibold">Comment:</span> {existingReviews[result.documentId].comment}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Show review actions */
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md flex-shrink-0">
                              <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">Review This Document</div>
                              <div className="text-xs text-slate-600">Approve, reject, or add comments based on the AI analysis above</div>
                            </div>
                          </div>

                          {/* Comment textarea - shown by default but can be empty */}
                          <Textarea
                            value={documentComments[result.documentId] || ''}
                            onChange={(e) => setDocumentComments({ ...documentComments, [result.documentId]: e.target.value })}
                            className="mb-3 bg-white"
                            placeholder="Add your review comments (optional)..."
                            rows={3}
                          />

                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleDocumentAction(result.documentId, 'approved', document.documentTypeName)}
                              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md"
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              Approve Document
                            </Button>
                            <Button
                              onClick={() => handleDocumentAction(result.documentId, 'rejected', document.documentTypeName)}
                              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-md"
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              Reject Document
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Show Supervisor Reviews section even when NOT analyzed yet (for funders) */}
      {!showResults && userRole === 'funder' && documents.some(doc => doc.reviews && doc.reviews.some(r => r.reviewerRole === 'supervisor')) && (
        <div className="space-y-4">
          <div className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2 mt-4">
            <User className="w-5 h-5" />
            Supervisor Reviews
          </div>
          {documents.map((document) => {
            const supervisorReviews = document.reviews?.filter(r => r.reviewerRole === 'supervisor') || [];
            if (supervisorReviews.length === 0) return null;

            return (
              <Card key={document.id} className="border-2 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                <CardContent className="pt-5">
                  <div className="mb-4">
                    <div className="font-bold text-slate-800 mb-1">{document.documentTypeName}</div>
                    <div className="text-xs text-slate-600">{document.fileName}</div>
                  </div>

                  <div className="space-y-2">
                    {supervisorReviews.map((review, reviewIdx) => (
                      <div 
                        key={reviewIdx}
                        className={`p-3 rounded-lg border-2 ${
                          review.status === 'approved'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {review.status === 'approved' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <div>
                              <div className="text-xs font-bold text-slate-800">
                                {review.reviewerName}
                              </div>
                              <Badge 
                                variant="outline" 
                                className="text-xs mt-1 bg-white"
                              >
                                🛡️ Supervisor
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`text-xs ${
                                review.status === 'approved'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-red-600 text-white'
                              }`}
                            >
                              {review.status === 'approved' ? 'Approved' : 'Rejected'}
                            </Badge>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(review.reviewedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <div className="mt-2 p-2 bg-white/70 rounded text-xs text-slate-700">
                            <span className="font-semibold">Comment:</span> {review.comment}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Show Funder Reviews section even when NOT analyzed yet (for supervisors) */}
      {!showResults && userRole === 'supervisor' && documents.some(doc => doc.reviews && doc.reviews.some(r => r.reviewerRole === 'funder')) && (
        <div className="space-y-4">
          <div className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2 mt-4">
            <User className="w-5 h-5" />
            Funder Reviews
          </div>
          {documents.map((document) => {
            const funderReviews = document.reviews?.filter(r => r.reviewerRole === 'funder') || [];
            if (funderReviews.length === 0) return null;

            return (
              <Card key={document.id} className="border-2 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="pt-5">
                  <div className="mb-4">
                    <div className="font-bold text-slate-800 mb-1">{document.documentTypeName}</div>
                    <div className="text-xs text-slate-600">{document.fileName}</div>
                  </div>

                  <div className="space-y-2">
                    {funderReviews.map((review, reviewIdx) => (
                      <div 
                        key={reviewIdx}
                        className={`p-3 rounded-lg border-2 ${
                          review.status === 'approved'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {review.status === 'approved' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <div>
                              <div className="text-xs font-bold text-slate-800">
                                {review.reviewerName}
                              </div>
                              <Badge 
                                variant="outline" 
                                className="text-xs mt-1 bg-white"
                              >
                                💰 Funder
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`text-xs ${
                                review.status === 'approved'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-red-600 text-white'
                              }`}
                            >
                              {review.status === 'approved' ? 'Approved' : 'Rejected'}
                            </Badge>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(review.reviewedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <div className="mt-2 p-2 bg-white/70 rounded text-xs text-slate-700">
                            <span className="font-semibold">Comment:</span> {review.comment}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}