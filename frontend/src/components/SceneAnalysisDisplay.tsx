/**
 * SceneAnalysisDisplay Component
 * Displays AI-powered classroom scene analysis with insights
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Users, Lightbulb, AlertCircle, Sparkles, Clock } from 'lucide-react';

interface SceneAnalysisDisplayProps {
  sceneDescription: string;
  activity: string;
  engagementLevel: string;
  engagement: number;
  studentCount: number;
  behavioralInsights: string[];
  teacherRecommendation: string;
  frameCount: number;
  provider: string;
  fallback: boolean;
  status?: 'processing';
  nextAnalysisIn?: number;
}

const engagementColors: Record<string, { bg: string; text: string; bar: string }> = {
  very_high: { bg: 'bg-emerald-100', text: 'text-emerald-800', bar: 'bg-emerald-500' },
  high: { bg: 'bg-green-100', text: 'text-green-800', bar: 'bg-green-500' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', bar: 'bg-yellow-500' },
  low: { bg: 'bg-orange-100', text: 'text-orange-800', bar: 'bg-orange-500' },
  very_low: { bg: 'bg-red-100', text: 'text-red-800', bar: 'bg-red-500' },
};

const activityLabels: Record<string, string> = {
  group_discussion: 'Group Discussion',
  lecture_listening: 'Listening to Lecture',
  note_taking: 'Taking Notes',
  independent_work: 'Independent Work',
  raising_hand: 'Raising Hand',
  distracted: 'Distracted',
  sleeping: 'Sleeping',
  classroom_activity: 'Classroom Activity',
  unknown: 'Observing',
};

export function SceneAnalysisDisplay({
  sceneDescription,
  activity,
  engagementLevel,
  engagement,
  studentCount,
  behavioralInsights,
  teacherRecommendation,
  frameCount,
  provider,
  fallback,
  status,
  nextAnalysisIn,
}: SceneAnalysisDisplayProps) {
  const engagementColor = engagementColors[engagementLevel] || engagementColors.medium;
  const engagementPercentage = Math.round(engagement * 100);

  // If processing, show lightweight update
  if (status === 'processing') {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
            <span className="text-sm text-gray-600">
              Processing... Next AI analysis in {nextAnalysisIn} frames
            </span>
          </div>
          <Badge variant="outline" className="bg-blue-50">
            Frame {frameCount}
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Scene Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">AI Scene Analysis</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-white">
                    {provider === 'blip2_local' ? '🤖 BLIP-2' : '✨ GPT-4'}
                  </Badge>
                  <span className="text-xs text-gray-500">Frame {frameCount}</span>
                </div>
              </div>
            </div>
            
            {fallback && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                <AlertCircle className="w-3 h-3 mr-1" />
                Fallback Mode
              </Badge>
            )}
          </div>

          {/* Scene Description */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <p className="text-gray-800 leading-relaxed">{sceneDescription}</p>
            </div>
          </div>

          {/* Activity & Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Activity</div>
              <div className="font-medium text-gray-900">
                {activityLabels[activity] || activity}
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="text-sm text-gray-600">Students</div>
                  <div className="font-medium text-gray-900">{studentCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Engagement Card */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Engagement Level</h4>
            <Badge className={`${engagementColor.bg} ${engagementColor.text} border-0`}>
              {engagementLevel.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          <Progress 
            value={engagementPercentage} 
            className={`h-3 ${engagementColor.bar}`}
          />
          <p className="text-sm text-gray-600">
            {engagementPercentage}% engaged
          </p>
        </div>
      </Card>

      {/* Behavioral Insights */}
      {behavioralInsights && behavioralInsights.length > 0 && (
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h4 className="font-medium text-gray-900">Behavioral Insights</h4>
            </div>
            <ul className="space-y-2">
              {behavioralInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* Teacher Recommendation */}
      {teacherRecommendation && (
        <Alert className={
          teacherRecommendation.toLowerCase().includes('no intervention') 
            ? 'border-green-200 bg-green-50' 
            : 'border-blue-200 bg-blue-50'
        }>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <strong>Recommendation:</strong> {teacherRecommendation}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
