import { useState, useRef } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Trash2, 
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
}

interface UploadedDocument {
  id: string;
  documentTypeId: string;
  documentTypeName: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  fileUrl: string;
}

interface DocumentUploadCardProps {
  docType: DocumentType;
  uploadedDoc?: UploadedDocument;
  onUpload: (docTypeId: string, docTypeName: string, file: File) => void;
  onRemove: (docId: string) => void;
}

export function DocumentUploadCard({ docType, uploadedDoc, onUpload, onRemove }: DocumentUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onUpload(docType.id, docType.name, file);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`
          relative overflow-hidden transition-all duration-300
          ${uploadedDoc ? 'border-2 border-green-500 bg-green-50/50' : ''}
          ${isDragging ? 'border-2 border-blue-500 bg-blue-50 scale-[1.02]' : ''}
          ${!uploadedDoc && !isDragging ? 'hover:shadow-lg hover:border-slate-300' : ''}
        `}
      >
        {/* Gradient background for uploaded docs */}
        {uploadedDoc && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-50" />
        )}

        <CardContent className="pt-5 pb-5 relative">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{docType.name}</h4>
                  {docType.required && (
                    <Badge variant="destructive" className="text-xs h-5">
                      Required
                    </Badge>
                  )}
                  {uploadedDoc && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Badge className="text-xs h-5 bg-green-600 hover:bg-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-slate-600 mb-2">{docType.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {docType.acceptedFormats.map((format, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs h-5">
                      .{format.toLowerCase()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Area or Uploaded File Display */}
            {uploadedDoc ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg border-2 border-green-500 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{uploadedDoc.fileName}</div>
                      <div className="text-xs text-slate-600">
                        {formatFileSize(uploadedDoc.fileSize)} • {new Date(uploadedDoc.uploadedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(uploadedDoc.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ) : isUploading ? (
              <div className="p-6 border-2 border-blue-500 rounded-lg bg-blue-50">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-blue-700">Uploading...</span>
                    <span className="text-blue-600">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative p-8 border-2 border-dashed rounded-lg cursor-pointer
                  transition-all duration-300 group
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={docType.acceptedFormats.map(f => `.${f.toLowerCase()}`).join(',')}
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center text-center space-y-3">
                  <motion.div
                    animate={{ 
                      y: isDragging ? -5 : 0,
                      scale: isDragging ? 1.1 : 1
                    }}
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      ${isDragging 
                        ? 'bg-blue-500' 
                        : 'bg-gradient-to-br from-slate-200 to-slate-300 group-hover:from-blue-100 group-hover:to-blue-200'
                      }
                      transition-all duration-300
                    `}
                  >
                    <Upload className={`w-7 h-7 ${isDragging ? 'text-white' : 'text-slate-600 group-hover:text-blue-600'}`} />
                  </motion.div>
                  
                  <div>
                    <p className="font-medium text-slate-700 mb-1">
                      {isDragging ? 'Drop file here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Accepted: {docType.acceptedFormats.map(f => f.toUpperCase()).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
