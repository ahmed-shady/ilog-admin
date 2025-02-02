import { ReactNode, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VARIANT_TYPES } from '../../utils/component-properties';
import { OverlayLoading } from '../OverlayLoading';

export interface SmallBoxProps {
  loading?: 'light' | boolean;
  variant: VARIANT_TYPES;
  icon?: {
    content: ReactNode;
    variant?: VARIANT_TYPES;
  };
  text: any;
  title: string;
  navigateTo: string;
  navigateOptions?: any;
}

const SmallBox = ({
  variant = 'info',
  icon,
  text,
  title,
  navigateTo,
  navigateOptions,
  loading,
}: SmallBoxProps) => {
  const [t] = useTranslation();
  const navigate = useNavigate();

  const iconContent = useMemo(() => {
    const iconVariant = icon?.variant || variant;

    return (
      <span className={`icon ${iconVariant ? `bg-${iconVariant}` : ''}`}>
        {icon?.content || <i className="far fa-envelope" />}
      </span>
    );
  }, [icon, variant]);

  const clicked = () => {
    navigateTo && navigate(navigateTo, navigateOptions);
  }
  return (
    <div className={`small-box bg-${variant}`} onClick = {clicked} style={{cursor: "pointer"}}>
      <div className="inner">
        <h3>{text}</h3>
        <p>{title}</p>
      </div>
      {iconContent}
      {false && <Link to={navigateTo} className="small-box-footer">
        <span className="mr-2">{t('main.label.moreInfo')}</span>
        <i className="fa fa-arrow-circle-right" />
      </Link>}

      {loading && (
        <OverlayLoading
          type={typeof loading === 'string' ? loading : 'dark'}
        />
      )}
    </div>
  );
};

export default SmallBox;
