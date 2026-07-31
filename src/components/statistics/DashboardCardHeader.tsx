import { ReactNode } from 'react';

import './DashboardCardHeader.scss';

interface Props {
  /** Font Awesome icon class, e.g. "fas fa-user-md" */
  icon: string;
  title: string;
  subtitle?: string;
  /** Right-side content (KPIs, buttons, …) */
  actions?: ReactNode;
}

const DashboardCardHeader = ({ icon, title, subtitle, actions }: Props) => (
  <div className="dash-card-header">
    <div className="dash-card-header__title">
      <span className="dash-card-header__icon">
        <i className={icon} />
      </span>
      <div>
        <h5>{title}</h5>
        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
    {actions && <div className="dash-card-header__actions">{actions}</div>}
  </div>
);

export default DashboardCardHeader;
