import React from 'react';
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface ContentHeaderProps {
  title: string;
  breadcrumbs?: Array<{ label: string; path?: string; active?: boolean }>;
  showBreadcrumbs?: boolean;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ 
  title, 
  breadcrumbs,
  showBreadcrumbs = true 
}) => {
  // Default breadcrumbs if none provided
  const defaultBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: title, active: true }
  ];

  const items = breadcrumbs || defaultBreadcrumbs;

  return (
    <section className="content-header">
      <Container fluid>
        <Row className="mb-2">
          <Col sm={6}>
            <h1>{title}</h1>
          </Col>
          {showBreadcrumbs && (
            <Col sm={6}>
              <Breadcrumb className="float-sm-end mb-0">
                {items.map((item, index) => (
                  <Breadcrumb.Item
                    key={index}
                    active={item.active}
                    linkAs={item.path && !item.active ? Link : 'span'}
                    linkProps={item.path && !item.active ? { to: item.path } : undefined}
                  >
                    {item.label}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default ContentHeader;
