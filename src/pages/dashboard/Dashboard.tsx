import DoctorsMap from "@app/components/statistics/DoctorsMap";
import DoctorsAgeChart from "@app/components/statistics/DoctorsAgeChart";
import DoctorsSpecialityChart from "@app/components/statistics/DoctorsSpecialityChart";
import { ContentHeader } from "@components";
import AppStats from "./AppStats";
import { Card, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import "./Dashboard.scss";
import { useState, useCallback } from "react";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import Speciality from "@app/types/Speciality";
import { listSpecialites } from "@app/api/SpecialityService";
import { listCountries } from "@app/api/CountryService";
import { Country } from "@app/types/Country";
import selectStyle from "@app/pages/doctors/util/SelectStyle";
import { useTranslation } from "react-i18next";
import DoctorTypeEnum from "@app/types/DoctorTypeEnum";

interface TypeOption {
  value: DoctorTypeEnum;
  label: string;
}

const Dashboard = () => {
  const [t] = useTranslation();
  const [mapStyle, setMapStyle] = useState<"light" | "dark">("light");

  const [allSpecialities, setAllSpecialities] = useState<Speciality[]>([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState<
    Speciality[]
  >([]);

  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

  const [selectedTypes, setSelectedTypes] = useState<TypeOption[]>([]);

  const filterByName = (inputValue: string, data: { name: string }[]) => {
    if (!inputValue) return data;
    const lower = inputValue.toLowerCase();
    return data
      .filter((el) => el.name.toLowerCase().includes(lower))
      .sort(
        (a, b) =>
          a.name.toLowerCase().indexOf(lower) -
          b.name.toLowerCase().indexOf(lower),
      );
  };

  const specialitiesLoader = useCallback(
    async (inputValue: string): Promise<Speciality[]> => {
      let data = allSpecialities;
      if (!data.length) {
        data = await listSpecialites();
        setAllSpecialities(data);
      }
      return filterByName(inputValue, data) as Speciality[];
    },
    [allSpecialities],
  );

  const countriesLoader = useCallback(
    async (inputValue: string): Promise<Country[]> => {
      let data = allCountries;
      if (!data.length) {
        data = await listCountries();
        setAllCountries(data);
      }
      return filterByName(inputValue, data) as Country[];
    },
    [allCountries],
  );

  const typeOptions: TypeOption[] = Object.values(DoctorTypeEnum).map(
    (type) => ({
      value: type,
      label: t(`doctors.types.${type.toLowerCase()}`),
    }),
  );

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
            <Card.Header className="bg-white border-0 py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-1 fw-bold">
                    <i className="fas fa-globe-americas me-2 text-info"></i>
                    Global Distribution
                  </h5>
                  <small className="text-muted">
                    Interactive map showing doctor distribution by country and
                    state
                  </small>
                </div>
                <div className="map-style-switcher-inline">
                  <ButtonGroup size="sm">
                    <Button
                      variant={
                        mapStyle === "light" ? "primary" : "outline-secondary"
                      }
                      onClick={() => setMapStyle("light")}
                    >
                      <i className="fas fa-sun me-1"></i>
                      Light
                    </Button>
                    <Button
                      variant={
                        mapStyle === "dark" ? "primary" : "outline-secondary"
                      }
                      onClick={() => setMapStyle("dark")}
                    >
                      <i className="fas fa-moon me-1"></i>
                      Dark
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <DoctorsMap mapStyle={mapStyle} />
            </Card.Body>
          </Card>

          {/* Doctors Age Distribution Chart */}
          <Card className="shadow-sm border-0 mx-0 mt-4 dashboard-age-chart-card">
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
          </Card>

          {/* Speciality Distribution Chart */}
          <Card className="shadow-sm border-0 mx-0 mt-4">
            <Card.Header className="bg-white border-0 py-3">
              <div>
                <h5 className="mb-1 fw-bold">
                  <i className="fas fa-chart-bar me-2 text-primary"></i>
                  Speciality Distribution
                </h5>
                <small className="text-muted">
                  Filter by speciality, country, and degree to view doctor
                  distribution
                </small>
              </div>
            </Card.Header>
            <Card.Body className="px-4 pb-4">
              <Row className="mb-4 g-3">
                <Col md={4}>
                  <label className="form-label fw-semibold">
                    <i className="fas fa-stethoscope me-1 text-primary"></i>
                    Speciality
                  </label>
                  <AsyncSelect
                    placeholder="Select specialities..."
                    cacheOptions
                    isMulti
                    defaultOptions
                    loadOptions={specialitiesLoader}
                    value={selectedSpecialities}
                    styles={selectStyle}
                    onChange={(val) =>
                      setSelectedSpecialities((val as Speciality[]) ?? [])
                    }
                    getOptionValue={(option) => String(option.id)}
                    getOptionLabel={(option) => option.name}
                  />
                </Col>
                <Col md={4}>
                  <label className="form-label fw-semibold">
                    <i className="fas fa-globe me-1 text-info"></i>
                    Country
                  </label>
                  <AsyncSelect
                    placeholder="Select countries..."
                    cacheOptions
                    isMulti
                    defaultOptions
                    loadOptions={countriesLoader}
                    value={selectedCountries}
                    styles={selectStyle}
                    onChange={(val) =>
                      setSelectedCountries((val as Country[]) ?? [])
                    }
                    getOptionValue={(option) => String(option.id)}
                    getOptionLabel={(option) => option.name}
                  />
                </Col>
                <Col md={4}>
                  <label className="form-label fw-semibold">
                    <i className="fas fa-user-md me-1 text-info"></i>
                    Type
                  </label>
                  <Select
                    placeholder="Select Type..."
                    isMulti
                    options={typeOptions}
                    value={selectedTypes}
                    styles={selectStyle}
                    onChange={(val) =>
                      setSelectedTypes((val as TypeOption[]) ?? [])
                    }
                  />
                </Col>
              </Row>
              <DoctorsSpecialityChart
                selectedSpecialities={selectedSpecialities}
                selectedCountries={selectedCountries}
                selectedDegrees={selectedTypes.map((t) => t.value)}
              />
            </Card.Body>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
