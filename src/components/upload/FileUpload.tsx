import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  DocumentTextIcon, 
  CloudArrowUpIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { FileUploadProgress } from '../ui/ProgressBar';
import { useToast } from '../ui/Toast';
import { FILE_UPLOAD, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants';
import type { FileUploadState, UploadResult } from '../../types/analysis';

interface FileUploadProps {
  onUpload: (file: File) => Promise<UploadResult>;
  onAnalysisComplete?: (result: UploadResult) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onAnalysisComplete,
  acceptedFileTypes = FILE_UPLOAD.ALLOWED_TYPES,
  maxFileSize = FILE_UPLOAD.MAX_SIZE_MB,
  className = '',
}) => {
  const [uploadState, setUploadState] = useState<FileUploadState | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const toast = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Reset previous state
    setResult(null);
    
    // Set uploading state
    setUploadState({
      file,
      status: 'uploading',
      progress: 0,
    });

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => prev ? {
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        } : null);
      }, 200);

      // Process the file
      setUploadState(prev => prev ? { 
        ...prev, 
        status: 'processing', 
        progress: 90 
      } : null);
      
      const uploadResult = await onUpload(file);
      
      clearInterval(progressInterval);
      
      setUploadState(prev => prev ? {
        ...prev,
        status: uploadResult.success ? 'completed' : 'error',
        progress: 100,
        error: uploadResult.error,
      } : null);

      setResult(uploadResult);
      
      // Show success toast
      if (uploadResult.success) {
        toast.success(SUCCESS_MESSAGES.FILE_UPLOADED, 'Analysis completed successfully!');
      } else {
        toast.error('Upload Failed', uploadResult.error || ERROR_MESSAGES.GENERIC_ERROR);
      }
      
      if (onAnalysisComplete) {
        onAnalysisComplete(uploadResult);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadState(prev => prev ? {
        ...prev,
        status: 'error',
        progress: 0,
        error: errorMessage,
      } : null);
      
      toast.error('Upload Failed', errorMessage);
    }
  }, [onUpload, onAnalysisComplete]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
    multiple: false,
  });

  const clearUpload = () => {
    setUploadState(null);
    setResult(null);
  };

  const getStatusIcon = () => {
    if (!uploadState) return <CloudArrowUpIcon className="w-12 h-12 text-gray-400" />;
    
    switch (uploadState.status) {
      case 'uploading':
      case 'processing':
        return (
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">
                {uploadState.progress}%
              </span>
            </div>
          </div>
        );
      case 'completed':
        return <CheckCircleIcon className="w-12 h-12 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />;
      default:
        return <CloudArrowUpIcon className="w-12 h-12 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    if (!uploadState) {
      return {
        title: 'Upload your resume',
        description: `Drag and drop your resume here, or click to browse. Supports ${acceptedFileTypes.join(', ')} files up to ${maxFileSize}MB.`,
      };
    }

    switch (uploadState.status) {
      case 'uploading':
        return {
          title: 'Uploading...',
          description: `Uploading ${uploadState.file.name}`,
        };
      case 'processing':
        const fileType = uploadState.file.type;
        let processingMessage = 'Extracting text and calculating ATS score';
        
        if (fileType === 'application/pdf') {
          processingMessage = 'Parsing PDF document and analyzing content...';
        } else if (fileType.includes('word') || fileType.includes('document')) {
          processingMessage = 'Processing Word document and extracting text...';
        }
        
        return {
          title: 'Analyzing resume...',
          description: processingMessage,
        };
      case 'completed':
        return {
          title: 'Analysis complete!',
          description: result?.analysis ? 
            `ATS Score: ${result.analysis.atsScore.overall}/100` : 
            'Resume processed successfully',
        };
      case 'error':
        return {
          title: 'Upload failed',
          description: uploadState.error || 'Something went wrong. Please try again.',
        };
      default:
        return {
          title: 'Upload your resume',
          description: 'Drag and drop your resume here',
        };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className={`file-upload ${className}`}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : uploadState?.status === 'error'
            ? 'border-red-300 bg-red-50'
            : uploadState?.status === 'completed'
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          }
          ${uploadState?.status === 'processing' || uploadState?.status === 'uploading' 
            ? 'pointer-events-none' 
            : ''
          }
        `}
      >
        <input {...getInputProps()} />
        
        {/* Clear button */}
        {uploadState && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearUpload();
            }}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear upload"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}

        {/* Status Icon */}
        <div className="flex justify-center mb-4">
          {getStatusIcon()}
        </div>

        {/* Status Message */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {statusMessage.title}
          </h3>
          <p className="text-sm text-gray-600">
            {statusMessage.description}
          </p>
        </div>

        {/* File Upload Progress */}
        {uploadState && (uploadState.status === 'uploading' || uploadState.status === 'processing') && (
          <div className="mt-4">
            <FileUploadProgress
              progress={uploadState.progress}
              fileName={uploadState.file.name}
            />
          </div>
        )}

        {/* File Info - Success/Error States */}
        {uploadState && (uploadState.status === 'completed' || uploadState.status === 'error') && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="w-5 h-5 text-gray-400" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">
                  {uploadState.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(uploadState.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {uploadState.status === 'completed' && (
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              )}
              {uploadState.status === 'error' && (
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
        )}

        {/* File Rejection Errors */}
        {fileRejections.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="text-left">
                <h4 className="text-sm font-medium text-red-900 mb-1">
                  Upload Error
                </h4>
                {fileRejections.map(({ file, errors }) => (
                  <div key={file.name} className="text-sm text-red-700">
                    <p className="font-medium">{file.name}:</p>
                    <ul className="list-disc list-inside ml-2">
                      {errors.map((error) => (
                        <li key={error.code}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PDF Processing Help */}
        {uploadState?.status === 'error' && uploadState.error?.includes('PDF processing failed') && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <DocumentTextIcon className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-left">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  PDF Processing Tips
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>If you're having trouble with PDF uploads, try these alternatives:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Copy and paste your resume text into a .txt file</li>
                    <li>Save your resume as a Word document (.docx)</li>
                    <li>Try a different PDF if you have multiple versions</li>
                    <li>Ensure your PDF contains selectable text (not scanned images)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <DocumentTextIcon className="w-4 h-4" />
            <span>TXT, PDF, DOC, DOCX</span>
          </div>
          <div className="flex items-center space-x-1">
            <CloudArrowUpIcon className="w-4 h-4" />
            <span>Max {maxFileSize}MB</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircleIcon className="w-4 h-4" />
            <span>Secure & Private</span>
          </div>
        </div>
      </div>
    </div>
  );
};