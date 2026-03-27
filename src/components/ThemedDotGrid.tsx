'use client';
import DotGrid from './DotGrid';
import { useTheme } from './ThemeProvider';

interface ThemedDotGridProps {
  className?: string;
}

export default function ThemedDotGrid({ className }: ThemedDotGridProps) {
  const { theme } = useTheme();

  return (
    <DotGrid
      dotSize={2}
      gap={20}
      baseColor={theme === 'dark' ? '#232323' : '#d8d8d8'}
      activeColor={theme === 'dark' ? '#d1fe17' : '#a8d600'}
      proximity={50}
      shockRadius={100}
      shockStrength={1}
      maxSpeed={6000}
      resistance={100}
      returnDuration={0.1}
      className={className}
    />
  );
}
