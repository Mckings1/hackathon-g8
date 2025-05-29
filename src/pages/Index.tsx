
import React, { useState } from 'react';
import { RiskAssessment } from '@/components/RiskAssessment';
import { KYCWorkflow } from '@/components/KYCWorkflow';
import { Header } from '@/components/Header';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | null;

export interface UserData {
  email: string;
  phone: string;
  country: string;
  deviceType: string;
  name?: string;
  idDocument?: File;
  selfie?: File;
  proofOfAddress?: File;
}

const Index = () => {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(null);
  const [userData, setUserData] = useState<UserData>({
    email: '',
    phone: '',
    country: '',
    deviceType: 'desktop'
  });
  const [currentStep, setCurrentStep] = useState<'assessment' | 'verification'>('assessment');

  const handleRiskAssessment = (level: RiskLevel, data: UserData) => {
    setRiskLevel(level);
    setUserData(data);
    setCurrentStep('verification');
  };

  const resetFlow = () => {
    setRiskLevel(null);
    setCurrentStep('assessment');
    setUserData({
      email: '',
      phone: '',
      country: '',
      deviceType: 'desktop'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'assessment' ? (
          <RiskAssessment onAssessmentComplete={handleRiskAssessment} />
        ) : (
          <KYCWorkflow 
            riskLevel={riskLevel!} 
            userData={userData}
            onReset={resetFlow}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
