import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Check, AlertCircle, ArrowRight } from 'lucide-react';

interface ProofOfAddressStepProps {
  onComplete: (data: any) => void;
}

export const ProofOfAddressStep = ({ onComplete }: ProofOfAddressStepProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAnalysisComplete(false);
      setExtractedData(null);
    }
  };

  const processDocument = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    const steps = [
      { text: 'Analyzing document type...', delay: 1000 },
      { text: 'Extracting address information...', delay: 1500 },
      { text: 'Validating document authenticity...', delay: 1000 },
      { text: 'Cross-referencing address data...', delay: 800 }
    ];
    
    for (const step of steps) {
      setProcessingStep(step.text);
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }
    
    const mockExtractedData = {
      documentType: 'Utility Bill',
      address: '123 Main Street, Anytown, ST 12345',
      issueDate: '2024-01-15',
      isValid: true,
      confidence: 0.92
    };
    
    setExtractedData(mockExtractedData);
    setIsProcessing(false);
    setAnalysisComplete(true);
  };

  const handleContinue = () => {
    if (extractedData) {
      onComplete(extractedData);
    }
  };

  if (analysisComplete && extractedData) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <span>Address Verified Successfully</span>
          </CardTitle>
          <CardDescription>
            Your proof of address has been validated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Verified Information</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Document Type:</span>
                <p className="font-medium">{extractedData.documentType}</p>
              </div>
              <div>
                <span className="text-gray-600">Address:</span>
                <p className="font-medium">{extractedData.address}</p>
              </div>
              <div>
                <span className="text-gray-600">Issue Date:</span>
                <p className="font-medium">{extractedData.issueDate}</p>
              </div>
              <div>
                <span className="text-gray-600">Validation Status:</span>
                <p className="font-medium text-green-700">✓ Valid</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={() => {
                setFile(null);
                setAnalysisComplete(false);
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
          <CardTitle>Processing Address Document</CardTitle>
          <CardDescription>
            Our AI is analyzing your proof of address document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{processingStep}</span>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Our system is validating the document authenticity and extracting 
              address information for verification.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Upload Proof of Address</CardTitle>
        <CardDescription>
          Please upload a recent utility bill, bank statement, or other official document showing your address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="address-upload"
          />
          <label htmlFor="address-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {file ? file.name : 'Click to upload proof of address'}
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, PDF up to 10MB
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
              <h4 className="font-medium text-amber-800">Accepted documents:</h4>
              <ul className="mt-1 text-sm text-amber-700 space-y-1">
                <li>• Utility bills (electricity, gas, water, internet)</li>
                <li>• Bank or credit card statements</li>
                <li>• Government correspondence</li>
                <li>• Documents must be dated within the last 3 months</li>
              </ul>
            </div>
          </div>
        </div>

        <Button 
          onClick={processDocument} 
          disabled={!file}
          className="w-full"
        >
          Process Address Document
        </Button>
      </CardContent>
    </Card>
  );
};
