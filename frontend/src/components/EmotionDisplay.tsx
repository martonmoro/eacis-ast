/**
 * EmotionDisplay Component
 * Displays current detected emotion, activity, posture with confidence and engagement score
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smile, Meh, Frown, AlertCircle, Hand, Edit, User, Activity, Brain, Users, Lightbulb } from 'lucide-react';

interface EmotionDisplayProps {
  emotion: string;
  confidence: number;
  engagement: number;
  timestamp: number;
  // Pose-related props
  poseDetected?: boolean;
  posture?: string;
  postureConfidence?: number;
  activity?: string;
  activityConfidence?: number;
  handRaised?: boolean;
  writing?: boolean;
  engagementLevel?: string;
  alert?: boolean;
  alertReason?: string;
  // AI Scene Understanding props
  sceneDescription?: string;
  studentCount?: number;
  behavioralInsights?: string[];
  teacherRecommendation?: string;
  analysisType?: 'traditional' | 'ai_scene';
}

const emotionIcons: Record<string, React.ReactNode> = {
  happy: <Smile className="w-8 h-8 text-green-500" />,
  neutral: <Meh className="w-8 h-8 text-yellow-500" />,
  sad: <Frown className="w-8 h-8 text-blue-500" />,
  angry: <Frown className="w-8 h-8 text-red-500" />,
  surprise: <Smile className="w-8 h-8 text-purple-500" />,
  fear: <Frown className="w-8 h-8 text-orange-500" />,
  disgust: <Frown className="w-8 h-8 text-gray-500" />,
};

const emotionColors: Record<string, string> = {
  happy: 'bg-green-500',
  neutral: 'bg-yellow-500',
  sad: 'bg-blue-500',
  angry: 'bg-red-500',
  surprise: 'bg-purple-500',
  fear: 'bg-orange-500',
  disgust: 'bg-gray-500',
};

const getEngagementLevel = (score: number): string => {
  if (score >= 0.8) return 'High';
  if (score >= 0.5) return 'Medium';
  return 'Low';
};

const getEngagementColor = (score: number): string => {
  if (score >= 0.8) return 'text-green-600';
  if (score >= 0.5) return 'text-yellow-600';
  return 'text-red-600';
};

export const EmotionDisplay: React.FC<EmotionDisplayProps> = ({
  emotion,
  confidence,
  engagement,
  timestamp,
  poseDetected = false,
  posture = 'unknown',
  postureConfidence = 0,
  activity = 'unknown',
  activityConfidence = 0,
  handRaised = false,
  writing = false,
  engagementLevel = '',
  alert = false,
  alertReason = '',
  sceneDescription = '',
  studentCount = 0,
  behavioralInsights = [],
  teacherRecommendation = '',
  analysisType = 'traditional',
}) => {
  // Debug: Log what we're receiving
  console.log('EmotionDisplay props:', {
    analysisType,
    sceneDescription,
    behavioralInsights,
    teacherRecommendation,
    hasSceneDescription: !!sceneDescription,
    insightsLength: behavioralInsights?.length
  });

  const emotionCapitalized = emotion.charAt(0).toUpperCase() + emotion.slice(1);
  const icon = emotionIcons[emotion.toLowerCase()] || emotionIcons.neutral;
  const engagementColor = getEngagementColor(engagement);

  const formattedTime = new Date(timestamp * 1000).toLocaleTimeString();
  
  const getActivityIcon = () => {
    switch (activity?.toLowerCase()) {
      case 'hand_raised':
        return <Hand className="w-5 h-5 text-blue-500" />;
      case 'writing':
      case 'note_taking':
      case 'note_taking_during_lecture':
        return <Edit className="w-5 h-5 text-purple-500" />;
      case 'attentive':
      case 'lecture_listening':
        return <User className="w-5 h-5 text-green-500" />;
      case 'group_discussion':
        return <Users className="w-5 h-5 text-blue-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Current State</h2>
            {analysisType === 'ai_scene' && (
              <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Brain className="w-3 h-3 mr-1" />
                AI Analysis
              </Badge>
            )}
          </div>
          <span className="text-sm text-gray-500">{formattedTime}</span>
        </div>

        {/* Alert if needed */}
        {alert && alertReason && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{alertReason}</AlertDescription>
          </Alert>
        )}

        {/* AI Scene Description (if available) */}
        {analysisType === 'ai_scene' && sceneDescription && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-grow">
                <h3 className="font-semibold text-purple-900 mb-1">Scene Analysis</h3>
                <p className="text-gray-700 leading-relaxed">{sceneDescription}</p>
                {studentCount > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">{studentCount} student{studentCount > 1 ? 's' : ''} detected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Behavioral Insights */}
        {behavioralInsights && behavioralInsights.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Behavioral Insights
            </h3>
            <ul className="space-y-1">
              {behavioralInsights.map((insight, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Teacher Recommendation */}
        {teacherRecommendation && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <span className="font-semibold">Recommendation: </span>
              {teacherRecommendation}
            </AlertDescription>
          </Alert>
        )}

        {/* Traditional Analysis Display */}
        {analysisType === 'traditional' && (
          <>
            {/* Emotion Display */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">{icon}</div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-bold">{emotionCapitalized}</span>
                  <Badge
                    variant="secondary"
                    className={`${
                      emotionColors[emotion.toLowerCase()] || 'bg-gray-500'
                    } text-white`}
                  >
                    {Math.round(confidence * 100)}%
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Confidence</span>
                    <span className="font-medium">
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                  <Progress value={confidence * 100} className="h-2" />
                </div>
              </div>
            </div>

            {/* Activity & Posture (if pose detected) */}
            {poseDetected && (
              <div className="border-t pt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Activity</span>
                    <Badge variant="outline" className="capitalize flex items-center gap-1">
                      {getActivityIcon()}
                      {activity.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <Progress value={activityConfidence * 100} className="h-2" />
                  <div className="flex gap-2 mt-2">
                    {handRaised && (
                      <Badge variant="default" className="text-xs bg-blue-500">
                        ✋ Hand Raised
                      </Badge>
                    )}
                    {writing && (
                      <Badge variant="default" className="text-xs bg-purple-500">
                        ✍️ Taking Notes
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Posture</span>
                    <Badge variant="secondary" className="capitalize">
                      {posture.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <Progress value={postureConfidence * 100} className="h-2" />
                </div>
              </div>
            )}
          </>
        )}

        {/* Engagement Score (always show) */}
        <div className="border-t pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Overall Engagement</h3>
              <span className={`text-2xl font-bold ${engagementColor}`}>
                {engagement.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Level</span>
                <span className={`font-medium ${engagementColor}`}>
                  {engagementLevel || getEngagementLevel(engagement)}
                </span>
              </div>
              <Progress value={engagement * 100} className="h-3" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
