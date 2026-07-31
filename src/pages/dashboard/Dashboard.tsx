import DoctorsMap from "@app/components/statistics/DoctorsMap";
import DoctorsAgeChart from "@app/components/statistics/DoctorsAgeChart";
import { ContentHeader } from "@components";
import AppStats from "./AppStats";
import { Card, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import "./Dashboard.scss";
import { useState } from "react";
import DoctorsPerSpecialityChart from '@app/components/statistics/DoctorsPerSpecialityChart';
import DashboardCardHeader from '@app/components/statistics/DashboardCardHeader';
import './Dashboard.scss';

const Dashboard = () => {
  const [mapStyle, setMapStyle] = useState<"light" | "dark">("light");

  return (
    <div className="dashboard-page">
      <ContentHeader title="Dashboard" />

      <section className="content">
        <div className="container-fluid">
          {/* Welcome Section */}
          <div className="dashboard-welcome mb-4">
            <Row className="align-items-center">
              <Col md={8}>
                <h2 className="dashboard-title mb-2">
                  <i className="fas fa-chart-line me-2 text-primary"></i>
                  Analytics Overview
                </h2>
                <p className="dashboard-subtitle text-muted mb-0">
                  Monitor your platform's performance and global doctor
                  distribution
                </p>
              </Col>
              <Col md={4} className="text-md-end">
                <div className="dashboard-date">
                  <i className="far fa-calendar-alt me-2"></i>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </Col>
            </Row>
          </div>

          {/* Statistics Cards */}
          <div className="mb-4">
            <AppStats />
          </div>



          {/* Global Map Section */}
          <Card className="shadow-sm border-0 mx-0 dashboard-map-card">
            <Card.Header className="p-0 border-0 bg-transparent">
              <DashboardCardHeader
                icon="fas fa-globe-americas"
                title="Global Distribution"
                subtitle="Interactive map showing doctor distribution by country and state"
                actions={
                  <div className="map-style-switcher-inline">
                    <ButtonGroup size="sm">
                      <Button
                        variant={mapStyle === 'light' ? 'primary' : 'outline-secondary'}
                        onClick={() => setMapStyle('light')}
                      >
                        <i className="fas fa-sun me-1"></i>
                        Light
                      </Button>
                      <Button
                        variant={mapStyle === 'dark' ? 'primary' : 'outline-secondary'}
                        onClick={() => setMapStyle('dark')}
                      >
                        <i className="fas fa-moon me-1"></i>
                        Dark
                      </Button>
                    </ButtonGroup>
                  </div>
                }
              />
            </Card.Header>
            <Card.Body className="p-0">
              <DoctorsMap mapStyle={mapStyle} />
            </Card.Body>
          </Card>

          {/* Doctors Age Distribution Chart */}
          {/* <Card className="shadow-sm border-0 mx-0 mt-4 dashboard-age-chart-card">
            <Card.Header className="bg-white border-0 py-3">
              <div>
                <h5 className="mb-1 fw-bold">
                  <i className="fas fa-chart-bar me-2 text-primary"></i>
                  Doctors Age Distribution by Country
                </h5>
                <small className="text-muted">
                  Select one or more countries to compare doctor age groups
                </small>
              </div>
            </Card.Header>
            <Card.Body className="px-4 pb-4">
              <DoctorsAgeChart />
            </Card.Body>
          </Card> */}
          {/* Doctors by Speciality Section */}
          <div className="mb-4">
            <DoctorsPerSpecialityChart />
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
