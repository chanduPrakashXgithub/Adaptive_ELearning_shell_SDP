import React, { useState, useCallback, ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullscreenWrapperProps {
  children: ReactNode;
  isEnabled?: boolean;
  onExit?: () => void;
  title?: string;
  autoEnter?: boolean; // Auto-enter fullscreen when enabled
  restrictive?: boolean; // Prevent tab switching and other navigation
}

export function FullscreenWrapper({ children, isEnabled = false, onExit, title, autoEnter = false, restrictive = false }: FullscreenWrapperProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.warn('Failed to enter fullscreen:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (error) {
      console.warn('Failed to exit fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!isEnabled) return;
    
    if (!isFullscreen) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }, [isFullscreen, isEnabled, enterFullscreen, exitFullscreen]);

  const handleExit = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    }
    onExit?.();
  }, [isFullscreen, exitFullscreen, onExit]);

  // Auto-enter fullscreen when enabled
  useEffect(() => {
    if (isEnabled && autoEnter && !isFullscreen) {
      enterFullscreen();
    }
  }, [isEnabled, autoEnter, isFullscreen, enterFullscreen]);

  // Restrictive keyboard handling
  useEffect(() => {
    if (!restrictive || !isFullscreen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Allow only Escape key to exit
      if (event.key === 'Escape') {
        handleExit();
        return;
      }

      // Prevent common navigation shortcuts
      const preventedCombos = [
        // Tab switching
        event.altKey && event.key === 'Tab',
        event.ctrlKey && event.key === 'Tab',
        event.ctrlKey && event.shiftKey && event.key === 'Tab',
        // Window switching
        event.altKey && event.key === 'F4',
        event.metaKey && event.key === 'Tab',
        // New tab/window
        event.ctrlKey && event.key === 't',
        event.ctrlKey && event.key === 'n',
        event.ctrlKey && event.shiftKey && event.key === 'n',
        // Close tab/window
        event.ctrlKey && event.key === 'w',
        // Address bar
        event.ctrlKey && event.key === 'l',
        event.altKey && event.key === 'd',
        // Developer tools
        event.key === 'F12',
        event.ctrlKey && event.shiftKey && event.key === 'I',
        // Refresh
        event.key === 'F5',
        event.ctrlKey && event.key === 'r',
        // Back/Forward
        event.altKey && event.key === 'ArrowLeft',
        event.altKey && event.key === 'ArrowRight',
      ];

      if (preventedCombos.some(combo => combo)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isFullscreen) {
        // Optional: You could show a warning or pause the test
        console.warn('Tab switching detected during restrictive mode');
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [restrictive, isFullscreen, handleExit]);

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={cn(
      "relative",
      isFullscreen && "fixed inset-0 z-50 bg-background"
    )}>
      {isEnabled && (
        <div className={cn(
          "absolute top-4 right-4 z-10 flex gap-2",
          isFullscreen && "fixed"
        )}>
          {title && isFullscreen && (
            <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium">
              {title}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-background/80 backdrop-blur-sm"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          {onExit && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExit}
              className="bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
      <div className={cn(
        "h-full",
        isFullscreen && "p-16 overflow-auto"
      )}>
        {children}
      </div>
    </div>
  );
}