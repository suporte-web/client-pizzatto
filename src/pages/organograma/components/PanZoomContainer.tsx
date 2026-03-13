import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

interface PanZoomContainerProps {
  children: React.ReactNode;
}

const MIN_SCALE = 0.3;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.1;

const PanZoomContainer = ({ children }: PanZoomContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const startPositionRef = useRef({ x: 0, y: 0 });

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();

    setScale((prev) => {
      const direction = event.deltaY > 0 ? -1 : 1;
      const next = prev + direction * SCALE_STEP;
      return clamp(Number(next.toFixed(2)), MIN_SCALE, MAX_SCALE);
    });
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    setIsDragging(true);
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    startPositionRef.current = { ...position };
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;

    const dx = event.clientX - dragStartRef.current.x;
    const dy = event.clientY - dragStartRef.current.y;

    setPosition({
      x: startPositionRef.current.x + dx,
      y: startPositionRef.current.y + dy,
    });
  };

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [isDragging, stopDragging]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        position: "relative",
        overflow: "hidden",
        bgcolor: "#f8fafc",
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 10,
          display: "flex",
          gap: 1,
        }}
      >
        <Box
          component="button"
          onClick={() =>
            setScale((prev) => clamp(prev + 0.1, MIN_SCALE, MAX_SCALE))
          }
          sx={{
            border: "1px solid #d0d7de",
            bgcolor: "#fff",
            borderRadius: 2,
            px: 1.5,
            py: 0.8,
            cursor: "pointer",
          }}
        >
          +
        </Box>

        <Box
          component="button"
          onClick={() =>
            setScale((prev) => clamp(prev - 0.1, MIN_SCALE, MAX_SCALE))
          }
          sx={{
            border: "1px solid #d0d7de",
            bgcolor: "#fff",
            borderRadius: 2,
            px: 1.5,
            py: 0.8,
            cursor: "pointer",
          }}
        >
          -
        </Box>

        <Box
          component="button"
          onClick={resetView}
          sx={{
            border: "1px solid #d0d7de",
            bgcolor: "#fff",
            borderRadius: 2,
            px: 1.5,
            py: 0.8,
            cursor: "pointer",
          }}
        >
          Reset
        </Box>
      </Box>

      <Box
        ref={containerRef}
        onMouseDown={handleMouseDown}
        sx={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          cursor: isDragging ? "grabbing" : "grab",
          userSelect: "none",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: "80px",
            transform: `translate(calc(-50% + ${position.x}px), ${position.y}px) scale(${scale})`,
            transformOrigin: "top center",
            transition: isDragging ? "none" : "transform 0.05s linear",
            willChange: "transform",
            width: "max-content",
            pb: 16,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PanZoomContainer;
