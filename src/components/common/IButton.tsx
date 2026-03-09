import React from 'react';
import { Button, ButtonProps } from 'react-bootstrap';
import './IButton.scss';

interface IButtonProps extends Omit<ButtonProps, 'children'> {
  /**
   * The text content of the button
   */
  text: string;
  /**
   * Optional icon class (e.g., 'fas fa-search')
   */
  icon?: string;
  /**
   * Icon position relative to text
   */
  iconPosition?: 'left' | 'right';
  /**
   * Whether to show loading state
   */
  isLoading?: boolean;
  /**
   * Loading text to display when isLoading is true
   */
  loadingText?: string;
}

const IButton: React.FC<IButtonProps> = ({
  text,
  icon,
  iconPosition = 'left',
  isLoading = false,
  loadingText = 'Loading...',
  disabled,
  className = '',
  ...restProps
}) => {
  const renderIcon = () => {
    if (isLoading) {
      return <i className="fas fa-spinner fa-spin me-2"></i>;
    }
    if (icon) {
      const iconClass = iconPosition === 'left' ? `${icon} me-2` : `${icon} ms-2`;
      return <i className={iconClass}></i>;
    }
    return null;
  };

  const buttonText = isLoading ? loadingText : text;

  return (
    <Button
      className={`ibutton ${className}`}
      disabled={disabled || isLoading}
      {...restProps}
    >
      {iconPosition === 'left' && renderIcon()}
      {buttonText}
      {iconPosition === 'right' && renderIcon()}
    </Button>
  );
};

export default IButton;
