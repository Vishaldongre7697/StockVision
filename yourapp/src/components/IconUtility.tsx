// Import icons from lucide-react directly
import React from 'react';
import * as LucideIcons from 'lucide-react';

// Define icon props interface
interface IconProps {
  name?: keyof typeof LucideIcons;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

// Create a general Icon component
export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = 'currentColor',
  className = '',
  onClick
}) => {
  if (!name) return null;
  
  const LucideIcon = LucideIcons[name];
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }
  
  return (
    <LucideIcon 
      size={size} 
      color={color} 
      className={className}
      onClick={onClick}
    />
  );
};

// Export commonly used icons directly
export const SettingsIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Settings {...props} />;
export const HomeIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Home {...props} />;
export const BookmarkedIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Bookmark {...props} />;
export const BrainIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Brain {...props} />;
export const LineChartIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.LineChart {...props} />;
export const SearchIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Search {...props} />;
export const BellIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Bell {...props} />;
export const PlusIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Plus {...props} />;
export const AlertCircleIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.AlertCircle {...props} />;
export const MicIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Mic {...props} />;
export const ChevronDownIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.ChevronDown {...props} />;
export const ChevronUpIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.ChevronUp {...props} />;
export const Trash2Icon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Trash2 {...props} />;
export const StarIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Star {...props} />;
export const StarHalfIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.StarHalf {...props} />;
export const EyeIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.Eye {...props} />;
export const EyeOffIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.EyeOff {...props} />;
export const TrendingUpIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.TrendingUp {...props} />;
export const TrendingDownIcon = (props: Omit<IconProps, 'name'>) => <LucideIcons.TrendingDown {...props} />;
export const BarChart2Icon = (props: Omit<IconProps, 'name'>) => <LucideIcons.BarChart2 {...props} />; 