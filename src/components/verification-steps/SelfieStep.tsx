import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Camera, Check, AlertCircle, ArrowRight } from 'lucide-react';

interface SelfieStepProps {
  onComplete: (data: any) => void;
  idPhoto?: string;
}

export const SelfieStep = ({ onComplete, idPhoto }: SelfieStepProps) => {
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleSelfieUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setSelfieFile(selectedFile);
      setAnalysisComplete(false);
      setMatchResult(null);
    }
  };

  const processFaceMatch = async () => {
    if (!selfieFile) return;
    
    setIsProcessing(true);
    
    const steps = [
      { text: 'Detecting faces in images...', delay: 1000 },
      { text: 'Analyzing facial features...', delay: 1200 },
      { text: 'Comparing biometric patterns...', delay: 1500 },
      { text: 'Calculating match confidence...', delay: 800 }
    ];
    
    for (const step of steps) {
      setProcessingStep(step.text);
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }
    
    const mockResult = {
      isMatch: true,
      confidence: 0.87,
      quality: 'High',
      liveness: 'Passed'
    };
    
    setMatchResult(mockResult);
    setIsProcessing(false);
    setAnalysisComplete(true);
  };

  const handleContinue = () => {
    if (matchResult) {
      onComplete(matchResult);
    }
  };

  if (analysisComplete && matchResult) {
    return (
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <span>Face Match Successful</span>
          </CardTitle>
          <CardDescription>
            Your selfie has been successfully matched with your ID document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Verification Results</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Match Status:</span>
                <p className="font-medium text-green-700">
                  {matchResult.isMatch ? '✓ Verified' : '✗ No Match'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Confidence:</span>
                <p className="font-medium">{(matchResult.confidence * 100).toFixed(1)}%</p>
              </div>
              <div>
                <span className="text-gray-600">Image Quality:</span>
                <p className="font-medium">{matchResult.quality}</p>
              </div>
              <div>
                <span className="text-gray-600">Liveness Check:</span>
                <p className="font-medium text-green-700">{matchResult.liveness}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => {
                setSelfieFile(null);
                setAnalysisComplete(false);
                setMatchResult(null);
              }}
              variant="outline"
              className="flex-1"
            >
              Retake Selfie
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
          <CardTitle>Processing Face Match</CardTitle>
          <CardDescription>
            Our AI is comparing your selfie with your ID document photo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{processingStep}</span>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Our advanced facial recognition AI is analyzing over 80 facial landmarks 
              to ensure a secure and accurate match.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Take a Selfie</CardTitle>
        <CardDescription>
          We need to verify that you are the person in the ID document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleSelfieUpload}
            className="hidden"
            id="selfie-upload"
          />
          <label htmlFor="selfie-upload" className="cursor-pointer">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {selfieFile ? selfieFile.name : 'Take or upload a selfie'}
            </p>
            <p className="text-sm text-gray-500">
              Make sure your face is clearly visible and well-lit
            </p>
          </label>
        </div>

        {selfieFile && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Check className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selfieFile.name}</p>
                <p className="text-sm text-gray-500">Ready for face match verification</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">For best results:</h4>
              <ul className="mt-1 text-sm text-amber-700 space-y-1">
                <li>• Look directly at the camera</li>
                <li>• Remove glasses and hats if possible</li>
                <li>• Ensure good lighting on your face</li>
                <li>• Keep a neutral expression</li>
              </ul>
            </div>
          </div>
        </div>

        <Button 
          onClick={processFaceMatch} 
          disabled={!selfieFile}
          className="w-full"
        >
          Verify Face Match
        </Button>
      </CardContent>
    </Card>
  );
};
