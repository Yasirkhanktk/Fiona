import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  Eye, 
  Download,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadedDocument {
  id: string;
  documentTypeId: string;
  documentTypeName: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  fileUrl: string;
}

interface DocumentViewerProps {
  documents: UploadedDocument[];
}

export function DocumentViewer({ documents }: DocumentViewerProps) {
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [zoom, setZoom] = useState(100);

  const selectedDoc = documents[selectedDocIndex];

  const handleNext = () => {
    if (selectedDocIndex < documents.length - 1) {
      setSelectedDocIndex(selectedDocIndex + 1);
      setZoom(100);
    }
  };

  const handlePrevious = () => {
    if (selectedDocIndex > 0) {
      setSelectedDocIndex(selectedDocIndex - 1);
      setZoom(100);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No documents uploaded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Document Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {documents.map((doc, index) => (
          <motion.button
            key={doc.id}
            onClick={() => {
              setSelectedDocIndex(index);
              setZoom(100);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              flex-shrink-0 p-3 rounded-lg border-2 transition-all min-w-[180px]
              ${selectedDocIndex === index
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${selectedDocIndex === index
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                  : 'bg-gradient-to-br from-slate-200 to-slate-300'
                }
              `}>
                <FileText className={`w-5 h-5 ${selectedDocIndex === index ? 'text-white' : 'text-slate-600'}`} />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className={`text-xs font-medium truncate ${selectedDocIndex === index ? 'text-blue-700' : 'text-slate-700'}`}>
                  {doc.documentTypeName}
                </div>
                <div className="text-xs text-slate-500 truncate">{doc.fileName}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Document Viewer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDoc.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="overflow-hidden">
            {/* Header */}
            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-1 truncate">{selectedDoc.documentTypeName}</CardTitle>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="truncate">{selectedDoc.fileName}</span>
                    <span>•</span>
                    <span>{formatFileSize(selectedDoc.fileSize)}</span>
                    <span>•</span>
                    <span>{new Date(selectedDoc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 25))}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
                  <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 25))}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-slate-300 mx-1" />
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 min-h-[500px] flex items-center justify-center">
                <div 
                  className="bg-white shadow-2xl rounded-lg overflow-hidden"
                  style={{ transform: `scale(${zoom / 100})`, transition: 'transform 0.2s' }}
                >
                  {/* Document Preview - Mock */}
                  <div className="w-[600px] h-[800px] bg-white p-12 border border-slate-200">
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-300 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-5/6" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-8 bg-slate-100 rounded w-full mt-8" />
                      <div className="h-4 bg-slate-200 rounded w-4/5" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-32 bg-slate-100 rounded w-full mt-8 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Navigation */}
            {documents.length > 1 && (
              <div className="border-t bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={selectedDocIndex === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-slate-600">
                    Document {selectedDocIndex + 1} of {documents.length}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={selectedDocIndex === documents.length - 1}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
