/**
 * WebcamFeed Component
 * Captures webcam video stream and sends frames to backend via WebSocket
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Video, VideoOff, AlertCircle } from 'lucide-react';

interface WebcamFeedProps {
  onFrameCapture: (frameData: string) => void;
  isConnected: boolean;
}

export const WebcamFeed: React.FC<WebcamFeedProps> = ({
  onFrameCapture,
  isConnected,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Start webcam stream
   */
  const startWebcam = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Failed to access webcam. Please check permissions.');
      setIsStreaming(false);
    }
  }, []);

  /**
   * Stop webcam stream
   */
  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  /**
   * Capture frame from video and convert to base64
   */
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isConnected) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 JPEG
    try {
      const frameData = canvas.toDataURL('image/jpeg', 0.8);
      onFrameCapture(frameData);
    } catch (err) {
      console.error('Error capturing frame:', err);
    }
  }, [isConnected, onFrameCapture]);

  /**
   * Start capturing frames at regular intervals
   */
  useEffect(() => {
    if (isStreaming && isConnected) {
      // Capture frames every 500ms (2 FPS)
      intervalRef.current = setInterval(captureFrame, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStreaming, isConnected, captureFrame]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Webcam Feed</h2>
          <div className="flex gap-2">
            {!isStreaming ? (
              <Button onClick={startWebcam} className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Start Camera
              </Button>
            ) : (
              <Button
                onClick={stopWebcam}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <VideoOff className="w-4 h-4" />
                Stop Camera
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isConnected && isStreaming && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Waiting for server connection...
            </AlertDescription>
          </Alert>
        )}

        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-900">
              <div className="text-center">
                <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Camera Off</p>
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} className="hidden" />

        <div className="text-sm text-gray-500">
          <p>
            Status:{' '}
            <span
              className={`font-semibold ${
                isStreaming && isConnected ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isStreaming && isConnected
                ? 'Active'
                : isStreaming
                ? 'Camera Active (No Connection)'
                : 'Inactive'}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
};
