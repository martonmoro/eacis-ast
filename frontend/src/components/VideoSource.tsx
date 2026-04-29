/**
 * VideoSource Component
 * Supports both webcam and uploaded video file for analysis
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video, VideoOff, Upload, AlertCircle, Play, Pause, RotateCcw } from 'lucide-react';

interface VideoSourceProps {
  onFrameCapture: (frameData: string) => void;
  isConnected: boolean;
}

type SourceType = 'webcam' | 'upload';

export const VideoSource: React.FC<VideoSourceProps> = ({
  onFrameCapture,
  isConnected,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [sourceType, setSourceType] = useState<SourceType>('webcam');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

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
   * Handle video file upload
   */
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid video file.');
      return;
    }

    setError(null);
    setUploadedFile(file);

    // Create object URL and load video
    const videoUrl = URL.createObjectURL(file);
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
      videoRef.current.load();
    }
  }, []);

  /**
   * Play uploaded video
   */
  const playVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setIsStreaming(true);
    }
  }, []);

  /**
   * Pause uploaded video
   */
  const pauseVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  /**
   * Restart uploaded video
   */
  const restartVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setIsStreaming(true);
    }
  }, []);

  /**
   * Clear uploaded video
   */
  const clearVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
      if (videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setUploadedFile(null);
    setIsPlaying(false);
    setIsStreaming(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
   * Handle source type change
   */
  const handleSourceChange = useCallback((value: string) => {
    // Stop current source
    if (sourceType === 'webcam') {
      stopWebcam();
    } else {
      clearVideo();
    }
    setSourceType(value as SourceType);
  }, [sourceType, stopWebcam, clearVideo]);

  /**
   * Handle video end
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || sourceType !== 'upload') return;

    const handleEnded = () => {
      setIsPlaying(false);
      setIsStreaming(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [sourceType]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopWebcam();
      clearVideo();
    };
  }, [stopWebcam, clearVideo]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Video Source</h2>
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span>LIVE</span>
            </span>
          )}
        </div>

        <Tabs value={sourceType} onValueChange={handleSourceChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="webcam">
              <Video className="w-4 h-4 mr-2" />
              Webcam
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="webcam" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
                disabled={isPlaying}
              >
                <Upload className="w-4 h-4" />
                Choose Video
              </Button>
              
              {uploadedFile && (
                <>
                  {!isPlaying ? (
                    <Button
                      onClick={playVideo}
                      variant="default"
                      className="flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Play
                    </Button>
                  ) : (
                    <Button
                      onClick={pauseVideo}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </Button>
                  )}
                  
                  <Button
                    onClick={restartVideo}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restart
                  </Button>
                  
                  <Button
                    onClick={clearVideo}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <VideoOff className="w-4 h-4" />
                    Clear
                  </Button>
                </>
              )}
            </div>
            
            {uploadedFile && (
              <div className="text-sm text-gray-600">
                <p><strong>File:</strong> {uploadedFile.name}</p>
                <p><strong>Size:</strong> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </TabsContent>
        </Tabs>

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

        <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video ring-1 ring-gray-800">
          <video
            ref={videoRef}
            autoPlay={sourceType === 'webcam'}
            playsInline
            muted
            className="w-full h-full object-contain"
          />
          {!isStreaming && (
            <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-900">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800">
                  <VideoOff className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-base font-medium opacity-80">
                  {sourceType === 'webcam' ? 'Camera Off' : 'No Video Selected'}
                </p>
                <p className="text-xs opacity-50">
                  {sourceType === 'webcam'
                    ? 'Click "Start Camera" to begin'
                    : 'Click "Choose Video" to upload'}
                </p>
              </div>
            </div>
          )}
          {isStreaming && isConnected && (
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              <span>Sending frames</span>
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
                ? `${sourceType === 'webcam' ? 'Camera' : 'Video'} Active (No Connection)`
                : 'Inactive'}
            </span>
          </p>
          <p>
            Source:{' '}
            <span className="font-semibold">
              {sourceType === 'webcam' ? 'Webcam' : 'Uploaded Video'}
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
};
