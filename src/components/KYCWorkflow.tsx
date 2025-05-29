
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, ArrowUp, Shield, Camera, FileText, Home } from 'lucide-react';
import { RiskLevel, UserData } from '@/pages/Index';
import { BasicInfoStep } from './verification-steps/BasicInfoStep';
import { DocumentUploadStep } from './verification-steps/DocumentUploadStep';
import { SelfieStep } from './verification-steps/SelfieStep';
import { ProofOfAddressStep } from './verification-steps/ProofOfAddressStep';
import { VerificationComplete } from './verification-steps/VerificationComplete';

interface KYCWorkflowProps {
  riskLevel: RiskLevel;
  userData: UserData;
  onReset: () => void;
}

type StepType = 'basic' | 'document' | 'selfie' | 'address' | 'complete';

export const KYCWorkflow = ({ riskLevel, userData, onReset }: KYCWorkflowProps) => {
  const [currentStep, setCurrentStep] = useState<StepType>('basic');
  const [completedSteps, setCompletedSteps] = useState<StepType[]>([]);
  const [stepData, setStepData] = useState<any>({});

  const getRequiredSteps = (): StepType[] => {
    switch (riskLevel) {
      case 'LOW':
        return ['basic', 'complete'];
      case 'MEDIUM':
        return ['basic', 'document', 'selfie', 'complete'];
      case 'HIGH':
        return ['basic', 'document', 'selfie', 'address', 'complete'];
      default:
        return ['basic', 'complete'];
    }
  };

  const requiredSteps = getRequiredSteps();
  const currentStepIndex = requiredSteps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / requiredSteps.length) * 100;

  const handleStepComplete = (stepType: StepType, data: any) => {
    setCompletedSteps([...completedSteps, stepType]);
    setStepData({ ...stepData, [stepType]: data });
    
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < requiredSteps.length) {
      setCurrentStep(requiredSteps[nextStepIndex]);
    }
  };

  const getRiskBadgeColor = () => {
    switch (riskLevel) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-amber-100 text-amber-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepIcon = (step: StepType) => {
    switch (step) {
      case 'basic': return <FileText className="h-4 w-4" />;
      case 'document': return <Shield className="h-4 w-4" />;
      case 'selfie': return <Camera className="h-4 w-4" />;
      case 'address': return <Home className="h-4 w-4" />;
      case 'complete': return <Check className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStepTitle = (step: StepType) => {
    switch (step) {
      case 'basic': return 'Basic Information';
      case 'document': return 'ID Document';
      case 'selfie': return 'Selfie Verification';
      case 'address': return 'Proof of Address';
      case 'complete': return 'Complete';
      default: return '';
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return <BasicInfoStep onComplete={(data) => handleStepComplete('basic', data)} />;
      case 'document':
        return <DocumentUploadStep onComplete={(data) => handleStepComplete('document', data)} />;
      case 'selfie':
        return <SelfieStep onComplete={(data) => handleStepComplete('selfie', data)} idPhoto={stepData.document?.extractedPhoto} />;
      case 'address':
        return <ProofOfAddressStep onComplete={(data) => handleStepComplete('address', data)} />;
      case 'complete':
        return <VerificationComplete riskLevel={riskLevel} userData={userData} onReset={onReset} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Identity Verification</h2>
            <p className="text-gray-600">Complete your verification process</p>
          </div>
          <Badge className={getRiskBadgeColor()}>
            {riskLevel} RISK
          </Badge>
        </div>
        
        <Card className="bg-white/50 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStepIndex + 1} of {requiredSteps.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
            
            <div className="flex items-center space-x-4 overflow-x-auto">
              {requiredSteps.map((step, index) => (
                <div key={step} className="flex items-center space-x-2 flex-shrink-0">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${completedSteps.includes(step) 
                      ? 'bg-green-100 text-green-800' 
                      : currentStep === step 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-500'
                    }
                  `}>
                    {completedSteps.includes(step) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      getStepIcon(step)
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    completedSteps.includes(step) || currentStep === step 
                      ? 'text-gray-900' 
                      : 'text-gray-500'
                  }`}>
                    {getStepTitle(step)}
                  </span>
                  {index < requiredSteps.length - 1 && (
                    <ArrowUp className="h-4 w-4 text-gray-300 rotate-90" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {renderCurrentStep()}
    </div>
  );
};
