import React, { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';

// Cross-platform view component (div for web)
export const FlexContainer: React.FC<{
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ children, className = '', style = {}, onClick }) => {
  return (
    <div 
      className={`flex ${className}`} 
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Cross-platform touchable component (button for web)
export const TouchableComponent: React.FC<{
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onPress?: () => void;
}> = ({ children, className = '', style = {}, onPress }) => {
  return (
    <button 
      className={`${className}`} 
      style={style}
      onClick={onPress}
    >
      {children}
    </button>
  );
};

// Responsive utilities
export const useIsMobile = () => {
  return useMediaQuery({ maxWidth: 767 });
};

export const useIsTablet = () => {
  return useMediaQuery({ minWidth: 768, maxWidth: 1023 });
};

export const useIsDesktop = () => {
  return useMediaQuery({ minWidth: 1024 });
};

// Platform detection
export const isPlatformWeb = () => true; // Always web
export const isPlatformMobile = () => 
  typeof navigator !== 'undefined' && 
  (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)); 