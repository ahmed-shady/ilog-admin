import { Button, ButtonGroup, Form } from "react-bootstrap";
import "./Doctors.scss";
import { useEffect, useState } from "react";

import DoctorTypeEnum from "@app/types/DoctorTypeEnum";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { listSpecialites } from "@app/api/SpecialityService";
import { listCountries, listCountryStates } from "@app/api/CountryService";
import Speciality from "@app/types/Speciality";
import { Country } from "@app/types/Country";
import { CountryState } from "@app/types/CountryState";
import selectStyle from "./util/SelectStyleDark";

import { useTranslation } from "react-i18next";

const DoctorsFilter = ({
  asideRef,
  showFilters,
  close,
  filterDto,
  setFilterDto,
}: any) => {
  const [allSpecialities, setAllSpecialities] = useState<Speciality[]>([]);
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [allStates, setAllStates] = useState<CountryState[]>([]);

  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<CountryState[]>([]);
  const [types, setTypes] = useState<DoctorTypeEnum[]>([]);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [hasPendingDocuments, setHasPendingDocuments] = useState<
    boolean | null
  >(null);

  const [isLoading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [t] = useTranslation();

  useEffect(() => {
    console.log("filterDto changed");
    const countries = allCountries.filter((c) =>
      filterDto.countries?.includes(c.name),
    );
    setCountries(countries);
    setSpecialities(
      allSpecialities.filter((s) => filterDto.specialitiesIds?.includes(s.id)),
    );
    const availableStates = allStates.filter((s) =>
      countries.some((c) => c.code === s.countryCode),
    );
    setAllStates(availableStates);
    setStates(
      states.filter((s) => availableStates.some((ss) => ss.name === s.name)),
    );
    countries.forEach((c) => {
      if (allStates.find((s) => s.countryCode === c.code)) {
        return;
      }
      console.log("fetching states of " + c.name);

      addStates(c).then((newStates) => {
        setStates([
          ...newStates.filter((s) => filterDto.states?.includes(s.name)),
        ]);
      });
    });
    setVerified(filterDto.verified);
    setTypes(filterDto.types || []);
    setHasPendingDocuments(filterDto.hasPendingDocuments);
  }, [filterDto, allCountries, allSpecialities]);

  useEffect(() => {
    const fetchSpecialities = async () => {
      const data = await listSpecialites();
      return data;
    };
    fetchSpecialities()
      .then((specialities) => {
        setAllSpecialities(specialities);
        setLoading(false);
      })
      .catch((error: any) => {
        setLoading(false);
      });
  }, []);

  const filterData = (inputValue: string, data: any[]) => {
    if (!inputValue) return data;
    let filtered = data.filter((element: any) =>
      element.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
    filtered.sort(
      (a, b) =>
        a.name.toLowerCase().indexOf(inputValue.toLowerCase()) -
        b.name.toLowerCase().indexOf(inputValue.toLowerCase()),
    );
    return filtered;
  };

  const countriesLoader = (inputValue: string) => {
    return new Promise<Country[]>(async (resolve) => {
      if (!allCountries || allCountries.length == 0) {
        const c = await listCountries();
        setAllCountries(c);
        resolve(c);
      } else resolve(filterData(inputValue, allCountries));
    });
  };

  const SpecialitiesLoader = (inputValue: string) => {
    return new Promise<Speciality[]>(async (resolve) => {
      if (!allSpecialities || allSpecialities.length == 0) {
        const s = await listSpecialites();
        setAllSpecialities(s);
        resolve(s);
      } else resolve(filterData(inputValue, allSpecialities));
    });
  };

  const countriesChange = (newCountries: Country[]) => {
    let removedCountry = countries.find(
      (c) => !newCountries.some((newC) => newC.code === c.code),
    );
    let addedCountry = newCountries.find(
      (newC) => !countries.some((c) => c.code === newC.code),
    );
    setCountries(newCountries);
    removedCountry &&
      setStates(states.filter((s) => s.countryCode !== removedCountry?.code));
    removedCountry &&
      setAllStates(
        allStates.filter((s) => s.countryCode !== removedCountry?.code),
      );
    addedCountry && addStates(addedCountry);
  };

  const addStates = async (country: Country) => {
    const s = await listCountryStates(country.code);
    const newStates = [...allStates, ...s];
    setAllStates([...allStates, ...s]);
    return newStates;
  };

  const typesChange = (e: any, type: DoctorTypeEnum) => {
    const checked = e.target.checked;
    if (types.includes(type) && !checked) {
      setTypes(types.filter((t) => t !== type));
    } else if (!types.includes(type) && checked) {
      setTypes([...types, type]);
    }
  };

  const handleVerifiedChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedValue =
      event.target.value === "true"
        ? true
        : event.target.value === "false"
          ? false
          : null;
    setVerified(selectedValue);
  };

  const reset = () => {
    setFilterDto({});
  };

  const apply = () => {
    const filterObj = {
      countries: countries.length > 0 ? countries.map((c) => c.name) : null,
      states: states.length > 0 ? states.map((s) => s.name) : null,
      specialitiesIds:
        specialities.length > 0 ? specialities.map((s) => s.id) : null,
      verified,
      types: types.length > 0 ? types : null,
      hasPendingDocuments,
    };
    setFilterDto(filterObj);
  };

  return (
    <aside
      ref={asideRef}
      className={(showFilters ? "open" : "closed") + " filter-sidebar"}
    >
      {/* Header */}
      <div className="filter-sidebar-header">
        <h6 className="filter-title">
          <i className="fas fa-sliders-h" />
          Filter Doctors
        </h6>
        <button
          type="button"
          className="filters-close-btn"
          onClick={close}
          aria-label="Close filters"
        >
          <i className="fas fa-times" />
        </button>
      </div>

      {/* Body */}
      <div className="filter-sidebar-body">
        <div className="filter-section">
          <div className="filter-section-label">
            <i className="fas fa-stethoscope" />
            Speciality
          </div>
          <AsyncSelect
            placeholder="Select speciality..."
            cacheOptions
            isMulti
            defaultOptions
            loadOptions={SpecialitiesLoader}
            value={specialities}
            styles={selectStyle}
            formatOptionLabel={(speciality) => (
              <div className="speciaity-option">
                <span style={{ padding: "10px" }}>{speciality.name}</span>
              </div>
            )}
            /*@ts-ignore*/
            onChange={(specialities) => setSpecialities(specialities)}
            getOptionValue={(option) => "" + option.id}
          />
        </div>

        <div className="filter-section">
          <div className="filter-section-label">
            <i className="fas fa-globe" />
            Country
          </div>
          <AsyncSelect
            placeholder="Select country..."
            cacheOptions
            isMulti
            defaultOptions
            loadOptions={countriesLoader}
            value={countries}
            styles={selectStyle}
            formatOptionLabel={(country) => (
              <div className="country-option">
                <img alt={country.code} src={country.image} />
                <span>{country.name}</span>
              </div>
            )}
            /*@ts-ignore*/
            onChange={countriesChange}
            getOptionValue={(option) => option.name}
          />
        </div>

        <div className="filter-section">
          <div className="filter-section-label">
            <i className="fas fa-map-marker-alt" />
            State / Region
          </div>
          <Select
            placeholder="Select state..."
            isMulti
            options={allStates}
            styles={selectStyle}
            value={states}
            formatOptionLabel={(state) => (
              <div className="state-option">
                <span style={{ padding: "1px" }}>{state.name}</span>
              </div>
            )}
            /*@ts-ignore*/
            onChange={(states) => {
              setStates(states);
            }}
            getOptionValue={(option) => option.name}
          />
        </div>

        <div className="filter-section">
          <div className="filter-section-label">
            <i className="fas fa-user-tag" />
            Doctor Type
          </div>
          <div className="d-flex flex-column gap-2 ps-1">
            {Object.values(DoctorTypeEnum).map(
              (option: DoctorTypeEnum, idx: number) => (
                <div key={idx} className="form-check mb-0">
                  <Form.Check
                    aria-label={option.toLowerCase()}
                    id={option.toLowerCase()}
                    name={option.toLowerCase()}
                    className="checkbox-primary"
                    checked={types.includes(option)}
                    onChange={(e) => typesChange(e, option)}
                  />
                  <Form.Label
                    className="form-check-label mb-0"
                    htmlFor={option.toLowerCase()}
                  >
                    {t(`doctors.types.${option.toLowerCase()}`)}
                  </Form.Label>
                </div>
              ),
            )}
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-section-label">
            <i className="fas fa-shield-alt" />
            Verification Status
          </div>
          <select
            id="verified"
            name="verified"
            className="form-control"
            value={String(verified)}
            onChange={handleVerifiedChange}
          >
            <option value="null">All doctors</option>
            <option value="true">Verified only</option>
            <option value="false">Not verified only</option>
          </select>
        </div>

        <div className="filter-section">
          <div className="filter-section-label">
            <i className="fas fa-file-alt" />
            Documents
          </div>
          <div className="form-check ps-1 d-flex">
            <Form.Check
              aria-label="has pending document(s)"
              id="pending-documents"
              name="pending-documents"
              className="checkbox-primary"
              style={{ marginLeft: "13px" }}
              checked={hasPendingDocuments || false}
              onChange={(e) => setHasPendingDocuments(e.target.checked || null)}
            />
            <Form.Label
              className="form-check-label mb-0"
              htmlFor="pending-documents"
            >
              With Pending Document(s)
            </Form.Label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="filter-sidebar-footer">
        <ButtonGroup className="filter-actions">
          <Button variant="primary" onClick={apply}>
            <i className="fas fa-check me-2" />
            Apply
          </Button>
          <Button variant="outline-danger" onClick={reset}>
            <i className="fas fa-undo me-2" />
            Reset
          </Button>
        </ButtonGroup>
      </div>
    </aside>
  );
};

export default DoctorsFilter;
