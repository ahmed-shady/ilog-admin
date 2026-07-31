import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';

import { listSpecialites } from '@app/api/SpecialityService';
import { listCountries } from '@app/api/CountryService';
import Speciality from '@app/types/Speciality';
import { Country } from '@app/types/Country';
import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import { SpecialityDistributionFilter as FilterDto } from '@app/types/SpecialityDistributionFilter';
import selectStyle from '@app/pages/doctors/util/SelectStyle';

import './SpecialityDistributionFilter.scss';

interface Props {
  onChange: (filter: FilterDto) => void;
}

const VERIFIED_OPTIONS: { key: string; label: string; value: boolean | null }[] = [
  { key: 'all', label: 'All', value: null },
  { key: 'verified', label: 'Verified', value: true },
  { key: 'unverified', label: 'Unverified', value: false },
];

const typeLabel = (type: DoctorTypeEnum) =>
  type.charAt(0) + type.slice(1).toLowerCase();

const SpecialityDistributionFilter = ({ onChange }: Props) => {
  const [allSpecialities, setAllSpecialities] = useState<Speciality[]>([]);
  const [allCountries, setAllCountries] = useState<Country[]>([]);

  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [types, setTypes] = useState<DoctorTypeEnum[]>([]);
  const [verified, setVerified] = useState<boolean | null>(null);

  const [collapsed, setCollapsed] = useState(true);

  // Load option lists once.
  useEffect(() => {
    listSpecialites().then(setAllSpecialities).catch(() => {});
    listCountries().then(setAllCountries).catch(() => {});
  }, []);

  // Emit a normalized filter whenever any selection changes (empty => omitted).
  useEffect(() => {
    onChange({
      specialitiesIds: specialities.length ? specialities.map((s) => s.id!) : undefined,
      countries: countries.length ? countries.map((c) => c.name) : undefined,
      types: types.length ? types : undefined,
      verified,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specialities, countries, types, verified]);

  const toggleType = (type: DoctorTypeEnum) =>
    setTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));

  const activeCount = useMemo(
    () =>
      (specialities.length ? 1 : 0) +
      (countries.length ? 1 : 0) +
      (types.length ? 1 : 0) +
      (verified !== null ? 1 : 0),
    [specialities, countries, types, verified]
  );
  const isDirty = activeCount > 0;

  const reset = () => {
    setSpecialities([]);
    setCountries([]);
    setTypes([]);
    setVerified(null);
  };

  return (
    <div className={`spec-filter${collapsed ? ' is-collapsed' : ''}`}>
      <div className="spec-filter__head">
        <button
          type="button"
          className="spec-filter__toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
        >
          <i className="fas fa-sliders" />
          <span>Filters</span>
          {activeCount > 0 && <span className="spec-filter__badge">{activeCount}</span>}
          <i className="fas fa-chevron-down spec-filter__chevron" />
        </button>
        {isDirty && (
          <button type="button" className="spec-filter__reset" onClick={reset}>
            <i className="fas fa-rotate-left" />
            Reset
          </button>
        )}
      </div>

      {!collapsed && (
      <div className="spec-filter__grid">
        <div className="spec-filter__field">
          <label>Specialities</label>
          <Select
            isMulti
            placeholder="All specialities"
            options={allSpecialities}
            value={specialities}
            styles={selectStyle}
            closeMenuOnSelect={false}
            getOptionValue={(o) => `${o.id}`}
            getOptionLabel={(o) => o.name}
            /*@ts-ignore*/
            onChange={(v) => setSpecialities(v as unknown as Speciality[])}
          />
        </div>

        <div className="spec-filter__field">
          <label>Countries</label>
          <Select
            isMulti
            placeholder="All countries"
            options={allCountries}
            value={countries}
            styles={selectStyle}
            closeMenuOnSelect={false}
            getOptionValue={(o) => o.name}
            getOptionLabel={(o) => o.name}
            formatOptionLabel={(country: Country) => (
              <div className="spec-filter__country">
                <img alt={country.code} src={country.image} />
                <span>{country.name}</span>
              </div>
            )}
            /*@ts-ignore*/
            onChange={(v) => setCountries(v as unknown as Country[])}
          />
        </div>

        <div className="spec-filter__field">
          <label>Doctor type</label>
          <div className="spec-filter__pills">
            {Object.values(DoctorTypeEnum).map((type) => (
              <button
                key={type}
                type="button"
                className={types.includes(type) ? 'is-active' : ''}
                onClick={() => toggleType(type)}
              >
                {typeLabel(type)}
              </button>
            ))}
          </div>
        </div>

        <div className="spec-filter__field">
          <label>Status</label>
          <div className="spec-filter__segmented" role="group" aria-label="Verified status">
            {VERIFIED_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={opt.value === verified ? 'is-active' : ''}
                onClick={() => setVerified(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default SpecialityDistributionFilter;
