
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Clock, Users } from 'lucide-react';
import { RiskLevel, UserData } from '@/pages/Index';

interface VerificationCompleteProps {
  riskLevel: RiskLevel;
  userData: UserData;
  onReset: () => void;
}

export const VerificationComplete = ({ riskLevel, userData, onReset }: VerificationCompleteProps) => {
  const getCompletionMessage = () => {
    switch (riskLevel) {
      case 'LOW':
        return {
          title: 'Quick Verification Complete!',
          subtitle: 'Your identity has been verified with minimal friction',
          processingTime: '2 minutes',
          stepsCompleted: 2
        };
      case 'MEDIUM':
        return {
          title: 'Standard Verification Complete!',
          subtitle: 'Your identity has been thoroughly verified',
          processingTime: '5 minutes',
          stepsCompleted: 4
        };
      case 'HIGH':
        return {
          title: 'Enhanced Verification Complete!',
          subtitle: 'Your identity has been verified with maximum security',
          processingTime: '8 minutes',
          stepsCompleted: 5
        };
      default:
        return {
          title: 'Verification Complete!',
          subtitle: 'Thank you for completing the verification process',
          processingTime: 'N/A',
          stepsCompleted: 0
        };
    }
  };

  const completion = getCompletionMessage();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">{completion.title}</CardTitle>
          <CardDescription className="text-lg">
            {completion.subtitle}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge className="bg-green-100 text-green-800 text-sm px-3 py-1">
              VERIFICATION SUCCESSFUL
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-800">Risk Level</p>
              <p className="text-lg font-bold text-blue-900">{riskLevel}</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-800">Processing Time</p>
              <p className="text-lg font-bold text-purple-900">{completion.processingTime}</p>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <Users className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-indigo-800">Steps Completed</p>
              <p className="text-lg font-bold text-indigo-900">{completion.stepsCompleted}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Verification Summary</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Email verified:</span>
                <span className="text-green-600 font-medium">✓ {userData.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone verified:</span>
                <span className="text-green-600 font-medium">✓ {userData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="text-green-600 font-medium">✓ {userData.country}</span>
              </div>
              {riskLevel !== 'LOW' && (
                <>
                  <div className="flex justify-between">
                    <span>ID Document:</span>
                    <span className="text-green-600 font-medium">✓ Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Face Match:</span>
                    <span className="text-green-600 font-medium">✓ 87% confidence</span>
                  </div>
                </>
              )}
              {riskLevel === 'HIGH' && (
                <div className="flex justify-between">
                  <span>Address Proof:</span>
                  <span className="text-green-600 font-medium">✓ Verified</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">What happens next?</h4>
            <p className="text-sm text-green-700">
              Your verification is complete! Our adaptive system processed your information efficiently 
              based on your risk profile, ensuring both security and user experience. You can now 
              access all platform features.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onReset}
              variant="outline"
              className="flex-1"
            >
              Try Another Verification
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Continue to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
