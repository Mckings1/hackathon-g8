import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Check, AlertCircle, X, FileX, ArrowRight } from 'lucide-react';

interface DocumentUploadStepProps {
  onComplete: (data: any) => void;
}

interface DocumentAnalysis {
  documentType: string;
  quality: number;
  isGovernmentIssued: boolean;
  isExpired: boolean;
  isTampered: boolean;
  resolution: 'high' | 'medium' | 'low';
  templateMatch: number;
  ocrConfidence: number;
  issues: string[];
}

export const DocumentUploadStep = ({ onComplete }: DocumentUploadStepProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [documentAnalysis, setDocumentAnalysis] = useState<DocumentAnalysis | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysisComplete(false);
      setDocumentAnalysis(null);
      setExtractedData(null);
    }
  };

  const analyzeDocumentQuality = async (file: File): Promise<DocumentAnalysis> => {
    // Simulate AI-powered document analysis
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    
    // Simulate different document types and their characteristics
    let analysis: DocumentAnalysis;
    
    if (fileName.includes('passport')) {
      analysis = {
        documentType: 'Passport',
        quality: 92,
        isGovernmentIssued: true,
        isExpired: false,
        isTampered: false,
        resolution: 'high',
        templateMatch: 95,
        ocrConfidence: 94,
        issues: []
      };
    } else if (fileName.includes('license') || fileName.includes('dl')) {
      analysis = {
        documentType: 'Driver\'s License',
        quality: fileSize > 1000000 ? 85 : 65,
        isGovernmentIssued: true,
        isExpired: Math.random() > 0.8,
        isTampered: false,
        resolution: fileSize > 1000000 ? 'high' : 'medium',
        templateMatch: 88,
        ocrConfidence: 91,
        issues: fileSize < 500000 ? ['Low resolution detected'] : []
      };
    } else if (fileName.includes('nin') || fileName.includes('national')) {
      analysis = {
        documentType: 'National ID (NIN)',
        quality: 78,
        isGovernmentIssued: true,
        isExpired: false,
        isTampered: Math.random() > 0.9,
        resolution: 'medium',
        templateMatch: 82,
        ocrConfidence: 85,
        issues: Math.random() > 0.7 ? ['Possible template mismatch'] : []
      };
    } else {
      analysis = {
        documentType: 'Unknown/Unsupported',
        quality: 45,
        isGovernmentIssued: false,
        isExpired: false,
        isTampered: false,
        resolution: 'low',
        templateMatch: 30,
        ocrConfidence: 40,
        issues: ['Unsupported document type', 'Cannot verify authenticity']
      };
    }

    // Add quality-based issues
    if (analysis.quality < 60) {
      analysis.issues.push('Poor image quality');
    }
    if (analysis.isExpired) {
      analysis.issues.push('Document appears to be expired');
    }
    if (analysis.isTampered) {
      analysis.issues.push('Possible tampering detected');
    }
    if (analysis.templateMatch < 70) {
      analysis.issues.push('Does not match official template');
    }

    return analysis;
  };

  const processDocument = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing steps with enhanced analysis
    const steps = [
      { text: 'Analyzing document type and format...', delay: 800 },
      { text: 'Checking document authenticity...', delay: 1200 },
      { text: 'Validating government template match...', delay: 1000 },
      { text: 'Performing enhanced OCR extraction...', delay: 1500 },
      { text: 'Detecting tampering and quality issues...', delay: 900 },
      { text: 'Calculating confidence scores...', delay: 600 }
    ];
    
    for (const step of steps) {
      setProcessingStep(step.text);
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    // Perform document analysis
    const analysis = await analyzeDocumentQuality(file);
    setDocumentAnalysis(analysis);
    
    // Simulate extracted data based on analysis quality
    if (analysis.quality >= 60 && analysis.isGovernmentIssued) {
      const mockExtractedData = {
        documentType: analysis.documentType,
        name: 'John Doe',
        dateOfBirth: '1990-05-15',
        documentNumber: analysis.documentType === 'Passport' ? 'P123456789' : 'DL123456789',
        expirationDate: analysis.isExpired ? '2022-05-15' : '2027-05-15',
        extractedPhoto: '/api/placeholder/150/200',
        confidence: analysis.ocrConfidence / 100,
        qualityScore: analysis.quality,
        analysis: analysis
      };
      setExtractedData(mockExtractedData);
    }
    
    setIsProcessing(false);
    setAnalysisComplete(true);
  };

  const handleContinue = () => {
    if (documentAnalysis) {
      const canProceed = documentAnalysis.quality >= 60 && 
                        documentAnalysis.isGovernmentIssued && 
                        !documentAnalysis.isExpired &&
                        documentAnalysis.issues.length === 0;
      
      onComplete({ 
        extractedData: extractedData || {}, 
        documentAnalysis: documentAnalysis,
        passed: canProceed 
      });
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-600';
    if (quality >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getQualityBadgeColor = (quality: number) => {
    if (quality >= 80) return 'bg-green-100 text-green-800';
    if (quality >= 60) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  if (analysisComplete && documentAnalysis) {
    const canProceed = documentAnalysis.quality >= 60 && 
                      documentAnalysis.isGovernmentIssued && 
                      !documentAnalysis.isExpired &&
                      documentAnalysis.issues.length === 0;

    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {canProceed ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span>Document Analysis Complete</span>
          </CardTitle>
          <CardDescription>
            {canProceed ? 
              'Your document has been successfully verified' : 
              'Issues detected with your document'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`border rounded-lg p-4 ${canProceed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-600 text-sm">Document Type:</span>
                <p className="font-medium">{documentAnalysis.documentType}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Quality Score:</span>
                <p className={`font-bold ${getQualityColor(documentAnalysis.quality)}`}>
                  {documentAnalysis.quality}%
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Government Issued:</span>
                <p className="font-medium">
                  {documentAnalysis.isGovernmentIssued ? '✓ Yes' : '✗ No'}
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Template Match:</span>
                <p className="font-medium">{documentAnalysis.templateMatch}%</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">OCR Confidence:</span>
                <p className="font-medium">{documentAnalysis.ocrConfidence}%</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Resolution:</span>
                <p className="font-medium capitalize">{documentAnalysis.resolution}</p>
              </div>
            </div>

            {documentAnalysis.issues.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Issues Detected:
                </h4>
                <ul className="space-y-1">
                  {documentAnalysis.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-red-700 flex items-center">
                      <X className="h-3 w-3 mr-1" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {extractedData && canProceed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Extracted Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{extractedData.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Date of Birth:</span>
                  <p className="font-medium">{extractedData.dateOfBirth}</p>
                </div>
                <div>
                  <span className="text-gray-600">Document Number:</span>
                  <p className="font-medium">{extractedData.documentNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">Expiration:</span>
                  <p className="font-medium">{extractedData.expirationDate}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button 
              onClick={() => {
                setFile(null);
                setAnalysisComplete(false);
                setDocumentAnalysis(null);
                setExtractedData(null);
              }}
              variant="outline"
              className="flex-1"
            >
              Upload Different Document
            </Button>
            
            <Button 
              onClick={handleContinue}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isProcessing) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>AI Document Analysis in Progress</CardTitle>
          <CardDescription>
            Performing comprehensive document validation and quality assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{processingStep}</span>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Our enhanced AI is analyzing document authenticity, template matching, 
              quality assessment, and performing OCR extraction. This comprehensive 
              analysis typically takes 15-20 seconds.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Upload Government-Issued ID</CardTitle>
        <CardDescription>
          Upload a clear, high-quality photo of your government-issued ID (NIN, Passport, Driver's License, or National ID)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {file ? file.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG up to 10MB • Government-issued documents only
            </p>
          </label>
        </div>

        {file && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Check className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Enhanced Verification Requirements:</h4>
              <ul className="mt-1 text-sm text-amber-700 space-y-1">
                <li>• Government-issued ID only (NIN, Passport, Driver's License)</li>
                <li>• High resolution image (minimum 1MB recommended)</li>
                <li>• All text must be clearly visible and readable</li>
                <li>• Document must not be expired</li>
                <li>• No signs of tampering or damage</li>
                <li>• Avoid glare, shadows, or blurry images</li>
              </ul>
            </div>
          </div>
        </div>

        <Button 
          onClick={processDocument} 
          disabled={!file}
          className="w-full"
        >
          Analyze Document with Enhanced AI
        </Button>
      </CardContent>
    </Card>
  );
};
