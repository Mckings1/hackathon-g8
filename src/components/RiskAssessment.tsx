
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { RiskLevel, UserData } from '@/pages/Index';

interface RiskAssessmentProps {
  onAssessmentComplete: (riskLevel: RiskLevel, userData: UserData) => void;
}

interface BehaviorMetrics {
  timeBetweenFields: number[];
  mouseMovements: number;
  keystrokes: number;
  tabSwitches: number;
  sessionDuration: number;
}

export const RiskAssessment = ({ onAssessmentComplete }: RiskAssessmentProps) => {
  const [formData, setFormData] = useState<UserData>({
    email: '',
    phone: '',
    country: '',
    deviceType: 'desktop'
  });
  const [isAssessing, setIsAssessing] = useState(false);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [behaviorMetrics, setBehaviorMetrics] = useState<BehaviorMetrics>({
    timeBetweenFields: [],
    mouseMovements: 0,
    keystrokes: 0,
    tabSwitches: 0,
    sessionDuration: 0
  });
  const [fieldStartTime, setFieldStartTime] = useState<number>(Date.now());

  // Simulate getting user's IP geolocation
  const getUserGeolocation = (): string => {
    // In a real implementation, this would use a geolocation API
    const mockGeolocations = ['Canada', 'Nigeria', 'United States', 'United Kingdom', 'Germany'];
    return mockGeolocations[Math.floor(Math.random() * mockGeolocations.length)];
  };

  // Analyze document quality (simulated)
  const analyzeDocumentQuality = (documentType: string): { quality: number; issues: string[] } => {
    // Simulate document analysis results
    const qualities = {
      'NIN': { quality: 85, issues: [] },
      'Passport': { quality: 95, issues: [] },
      'Driver\'s License': { quality: 80, issues: ['Low resolution'] },
      'National ID': { quality: 70, issues: ['Possible tampering detected'] },
      'Other': { quality: 40, issues: ['Unsupported document type', 'Poor quality'] }
    };
    
    return qualities[documentType as keyof typeof qualities] || qualities['Other'];
  };

  // Detect behavioral anomalies
  const detectBehaviorAnomalies = (metrics: BehaviorMetrics): { score: number; flags: string[] } => {
    const flags: string[] = [];
    let anomalyScore = 0;

    // Check typing speed (too fast might indicate bot)
    const avgTimePerField = metrics.timeBetweenFields.reduce((a, b) => a + b, 0) / metrics.timeBetweenFields.length;
    if (avgTimePerField < 500) { // Less than 0.5 seconds per field
      flags.push('Suspiciously fast form completion');
      anomalyScore += 30;
    }

    // Check mouse movement patterns
    if (metrics.mouseMovements < 10) {
      flags.push('Minimal mouse interaction');
      anomalyScore += 20;
    }

    // Check session duration
    if (metrics.sessionDuration < 30000) { // Less than 30 seconds
      flags.push('Very short session duration');
      anomalyScore += 15;
    }

    // Check for tab switching (might indicate automation)
    if (metrics.tabSwitches > 5) {
      flags.push('Excessive tab switching');
      anomalyScore += 25;
    }

    return { score: Math.min(anomalyScore, 100), flags };
  };

  const calculateRiskScore = (data: UserData): { score: number; factors: string[] } => {
    let score = 0;
    const factors: string[] = [];
    
    // Original geographic risk factors
    const highRiskCountries = ['Afghanistan', 'Iran', 'North Korea', 'Syria', 'Nigeria'];
    const mediumRiskCountries = ['Russia', 'China', 'Belarus'];
    
    if (highRiskCountries.includes(data.country)) {
      score += 25;
      factors.push(`High-risk country: ${data.country}`);
    } else if (mediumRiskCountries.includes(data.country)) {
      score += 15;
      factors.push(`Medium-risk country: ${data.country}`);
    }
    
    // Geolocation mismatch analysis
    const userGeoLocation = getUserGeolocation();
    if (userGeoLocation !== data.country) {
      score += 20;
      factors.push(`Geolocation mismatch: IP from ${userGeoLocation}, declared country ${data.country}`);
    }

    // Email domain analysis
    const emailDomain = data.email.split('@')[1];
    const trustedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'apple.com'];
    const temporaryDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com'];
    
    if (temporaryDomains.includes(emailDomain)) {
      score += 35;
      factors.push('Temporary email domain detected');
    } else if (!trustedDomains.includes(emailDomain)) {
      score += 10;
      factors.push('Uncommon email domain');
    }
    
    // Device type risk
    if (data.deviceType === 'mobile') {
      score += 5;
      factors.push('Mobile device usage');
    } else if (data.deviceType === 'tablet') {
      score += 8;
      factors.push('Tablet device usage');
    }
    
    // Phone validation
    if (data.phone.length < 10) {
      score += 15;
      factors.push('Invalid phone number format');
    }

    // Behavioral analysis
    const behaviorAnalysis = detectBehaviorAnomalies(behaviorMetrics);
    score += behaviorAnalysis.score * 0.3; // Weight behavioral factors
    factors.push(...behaviorAnalysis.flags);

    // Simulated document quality analysis
    const documentAnalysis = analyzeDocumentQuality('Driver\'s License'); // Simulate document type
    const documentQualityScore = (100 - documentAnalysis.quality) * 0.4;
    score += documentQualityScore;
    if (documentAnalysis.issues.length > 0) {
      factors.push(...documentAnalysis.issues.map(issue => `Document issue: ${issue}`));
    }
    
    return { score: Math.min(score, 100), factors };
  };

  const getRiskLevel = (score: number): RiskLevel => {
    if (score <= 30) return 'LOW';
    if (score <= 65) return 'MEDIUM';
    return 'HIGH';
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-amber-600';
      case 'HIGH': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case 'LOW': return <Shield className="h-5 w-5 text-green-600" />;
      case 'MEDIUM': return <TrendingUp className="h-5 w-5 text-amber-600" />;
      case 'HIGH': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  // Track user behavior
  const handleFieldFocus = () => {
    setFieldStartTime(Date.now());
    setBehaviorMetrics(prev => ({
      ...prev,
      mouseMovements: prev.mouseMovements + 1
    }));
  };

  const handleFieldBlur = () => {
    const timeTaken = Date.now() - fieldStartTime;
    setBehaviorMetrics(prev => ({
      ...prev,
      timeBetweenFields: [...prev.timeBetweenFields, timeTaken]
    }));
  };

  const handleKeyDown = () => {
    setBehaviorMetrics(prev => ({
      ...prev,
      keystrokes: prev.keystrokes + 1
    }));
  };

  const handleAssessment = async () => {
    setIsAssessing(true);
    
    // Update session duration
    setBehaviorMetrics(prev => ({
      ...prev,
      sessionDuration: Date.now() - fieldStartTime
    }));
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const { score, factors } = calculateRiskScore(formData);
    const level = getRiskLevel(score);
    
    setRiskScore(score);
    console.log('Risk Assessment Factors:', factors);
    
    // Continue to verification after a brief display
    setTimeout(() => {
      onAssessmentComplete(level, formData);
    }, 2000);
  };

  if (isAssessing || riskScore !== null) {
    const level = riskScore !== null ? getRiskLevel(riskScore) : null;
    
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl">Enhanced Risk Assessment</CardTitle>
            <CardDescription>Analyzing profile, behavior, and document readiness</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {riskScore === null ? (
              <>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing email domain...</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Checking geographic risk & IP location...</span>
                    <span className="text-green-600">✓</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Evaluating user behavior patterns...</span>
                    <span className="text-amber-500">⟳</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Preparing document quality analysis...</span>
                    <span className="text-amber-500">⟳</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Calculating final risk score...</span>
                    <span className="text-gray-400">○</span>
                  </div>
                </div>
                <Progress value={80} className="h-2" />
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  {getRiskIcon(level)}
                </div>
                <div>
                  <h3 className={`text-3xl font-bold ${getRiskColor(level)}`}>
                    {level} RISK
                  </h3>
                  <p className="text-gray-600 mt-2">Score: {Math.round(riskScore)}/100</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-gray-800 mb-2">Risk Factors Analyzed:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Geographic location & IP verification</li>
                    <li>• Email domain reputation analysis</li>
                    <li>• User interaction behavior patterns</li>
                    <li>• Document quality preparation assessment</li>
                    <li>• Device type and session metadata</li>
                  </ul>
                  <p className="text-sm text-gray-600 mt-3">
                    Proceeding to {level === 'LOW' ? 'streamlined' : level === 'MEDIUM' ? 'standard' : 'enhanced'} verification workflow...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Identity Verification</h2>
        <p className="text-lg text-gray-600">
          Our AI analyzes your profile, behavior, and document readiness to customize your verification experience
        </p>
      </div>

      <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>User Information & Behavior Analysis</CardTitle>
          <CardDescription>
            We analyze multiple factors including location, behavior patterns, and document quality indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                onFocus={handleFieldFocus}
                onBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country">Country of Residence</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, country: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                  <SelectItem value="Russia">Russia</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                  <SelectItem value="Iran">Iran</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="device">Device Type</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, deviceType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Enhanced Security Analysis</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Real-time behavior pattern analysis</li>
              <li>• Geographic location verification</li>
              <li>• Document quality pre-assessment</li>
              <li>• Email domain reputation check</li>
              <li>• Session metadata analysis</li>
            </ul>
          </div>

          <Button 
            onClick={handleAssessment}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            disabled={!formData.email || !formData.phone || !formData.country}
          >
            Begin Enhanced Risk Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
