import { Badge, Button, ButtonGroup, Card, Dropdown, DropdownButton, Form, InputGroup, Modal, Table } from 'react-bootstrap';
import './Doctors.scss'
import { useEffect, useState } from 'react';

import DoctorTypeEnum from '@app/types/DoctorTypeEnum';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import DOCTOR_TYPES_TEXT from './util/DoctorTypesText';
import { listSpecialites } from '@app/api/SpecialityService';
import { listCountries, listCountryStates } from '@app/api/CountryService';
import Speciality from '@app/types/Speciality';
import { Country } from '@app/types/Country';
import { CountryState } from '@app/types/CountryState';
import selectStyle from './util/SelectStyle';

const DoctorsFilter = ({ asideRef, showFilters, close, filterDto, setFilterDto }: any) => {
    const [allSpecialities, setAllSpecialities] = useState<Speciality[]>([]);
    const [allCountries, setAllCountries] = useState<Country[]>([]);
    const [allStates, setAllStates] = useState<CountryState[]>([]);

    const [specialities, setSpecialities] = useState<Speciality[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<CountryState[]>([]);
    const [types, setTypes] = useState<DoctorTypeEnum[]>([]);
    const [verified, setVerified] = useState<boolean | null>(null);
    const [hasPendingDocuments, setHasPendingDocuments] = useState<boolean | null>(null);

    const [isLoading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);


    useEffect(() => {
        console.log("filterDto changed");
        const countries = allCountries.filter(c => filterDto.countries?.includes(c.name));
        setCountries(countries);
        setSpecialities(allSpecialities.filter(s => filterDto.specialitiesIds?.includes(s.id)));
        const availableStates = allStates.filter(s => countries.some(c => c.code === s.countryCode));
        setAllStates(availableStates);
        setStates(states.filter(s => availableStates.some(ss => ss.name === s.name)));
        countries.forEach(c => {
            if (allStates.find(s => s.countryCode === c.code)) {
                return;
            }
            console.log("fetching states of " + c.name);

            addStates(c)
                .then((newStates) => {
                    setStates([...(newStates.filter(s => filterDto.states?.includes(s.name)))])
                })
        });
        setVerified(filterDto.verified);
        setTypes(filterDto.types || []);
        setHasPendingDocuments(filterDto.hasPendingDocuments);

    }, [filterDto, allCountries, allSpecialities])

    useEffect(() => {
        const fetchSpecialities = async () => {
            const data = await listSpecialites();
            return data;
        }
        fetchSpecialities().then(specialities => {
            setAllSpecialities(specialities);
            setLoading(false);

        }).catch((error: any) => {
            setLoading(false);

        });
    }, []);

    const filterData = (inputValue: string, data: any[]) => {
        if (!inputValue) return data;
        let filtered = data.filter((element: any) =>
            element.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        filtered.sort(
            (a, b) =>
                a.name.toLowerCase().indexOf(inputValue.toLowerCase()) -
                b.name.toLowerCase().indexOf(inputValue.toLowerCase())
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

    const countriesChange = (
        newCountries: Country[]
    ) => {
        let removedCountry = countries.find(c => !newCountries.some(newC => newC.code === c.code));
        let addedCountry = newCountries.find(newC => !countries.some(c => c.code === newC.code));
        setCountries(newCountries);
        removedCountry && setStates(states.filter(s => s.countryCode !== removedCountry?.code));
        removedCountry && setAllStates(allStates.filter(s => s.countryCode !== removedCountry?.code));
        addedCountry && addStates(addedCountry);


    };

    const addStates = async (country: Country) => {
        const s = await listCountryStates(country.code);
        const newStates = [...allStates, ...s];
        setAllStates([...allStates, ...s]);
        return newStates;

    }


    const typesChange = (e: any, type: DoctorTypeEnum) => {
        const checked = e.target.checked;
        if (types.includes(type) && !checked) {
            setTypes(types.filter(t => t !== type));
        } else if (!types.includes(type) && checked) {
            setTypes([...types, type]);
        }
    }

    const handleVerifiedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value === "true" ? true :
            (event.target.value === "false" ? false : null);
        setVerified(selectedValue);
    };

    const reset = () => {
        setFilterDto({});
    }

    const apply = () => {
        const filterObj = {
            countries: countries.length > 0 ? countries.map(c => c.name) : null,
            states: states.length > 0 ? states.map(s => s.name) : null,
            specialitiesIds: specialities.length > 0 ? specialities.map(s => s.id) : null,
            verified,
            types: types.length > 0 ? types : null,
            hasPendingDocuments
        }
        setFilterDto(filterObj);
    }

    return (
        <aside
            ref={asideRef}
            className={(showFilters ? "open" : "closed") + " filter-sidebar"}
            style={{
                top: 0,
                bottom: false ? '57px' : '0px',
                padding: `60px 16px 16px 16px`,
                overflowY: 'scroll',
                height: '100%'
            }}
        >
            <h5 className='text-center'>
                Filter Doctors
                <button type="button" className="close filters-close" onClick={close}>
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Close</span>
                </button>

            </h5>
            <hr className="mb-2" />

            <div style={{ padding: '8px 0' }}>
                <h6>Speciality</h6>

                <div className="mb-4">
                    <AsyncSelect
                        placeholder='Specialiy'
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

                <h6>Country</h6>

                <div className="mb-4">
                    <AsyncSelect
                        placeholder='Country'
                        cacheOptions
                        isMulti
                        defaultOptions
                        loadOptions={countriesLoader}
                        value={countries}
                        styles={selectStyle}
                        //menuPortalTarget={document.body}
                        formatOptionLabel={(country) => (
                            <div className="country-option">
                                <img
                                    style={{
                                        width: "30px",
                                    }}
                                    alt={country.code}
                                    src={country.image}
                                />
                                <span style={{ padding: "0px" }}>{country.name}</span>
                            </div>
                        )}
                        /*@ts-ignore*/
                        onChange={countriesChange}
                        getOptionValue={(option) => option.name}
                    />
                </div>

                <h6>State</h6>
                <div className="mb-4">
                    <Select
                        placeholder='State'
                        isMulti
                        options={allStates}
                        styles={selectStyle}
                        value={states}
                        //menuPortalTarget={document.body}
                        formatOptionLabel={(state) => (
                            <div className="state-option">
                                <span style={{ padding: "1px" }}>{state.name}</span>
                            </div>
                        )}
                        /*@ts-ignore*/
                        onChange={(states) => { setStates(states) }}
                        getOptionValue={(option) => option.name}
                    />
                </div>

                <h6>Doctor Type</h6>

                <div className="mb-4 mt-1 d-flex flex-column">

                    {[DoctorTypeEnum.TRAINEE, DoctorTypeEnum.CONSULTANT].map((option, idx) =>
                        <InputGroup key={idx}>
                            <Form.Check
                                aria-label={DOCTOR_TYPES_TEXT[option].toLowerCase()}
                                id={DOCTOR_TYPES_TEXT[option].toLowerCase()}
                                name={DOCTOR_TYPES_TEXT[option].toLowerCase()}
                                className="checkbox-primary"
                                checked={types.includes(option)}
                                onChange={(e) => typesChange(e, option)}
                            />
                            <Form.Label className="mb-0" htmlFor={DOCTOR_TYPES_TEXT[option].toLowerCase()}>{DOCTOR_TYPES_TEXT[option]}</Form.Label>
                        </InputGroup>
                    )}

                </div>
                <span>Verified?</span>

                <div className="mb-4 mt-1 d-flex flex-column">
                    <select
                        id="verified"
                        name="verified"
                        className="form-control"
                        value={String(verified)}
                        onChange={handleVerifiedChange}

                    >
                        <option value="null">All</option>
                        <option value="true">Verified</option>
                        <option value="false">Not Verified</option>
                    </select>


                </div>


                <div className="mb-4 mt-1 d-flex flex-column">
                    <InputGroup>
                        <Form.Check
                            aria-label='has pending document(s)'
                            id='pending-documents'
                            name='pending-documents'
                            className="checkbox-primary"
                            checked={hasPendingDocuments || false}
                            onChange={(e) => setHasPendingDocuments(e.target.checked || null)}
                        />
                        <Form.Label className="mb-0" htmlFor='pending-documents'>With Pending Document(s)</Form.Label>
                    </InputGroup>
                </div>

                <ButtonGroup size="sm" className="filter-actions">
                    <Button variant='primary' className='rounded' onClick={apply}>Apply</Button>
                    <Button variant='danger' className='rounded' onClick={reset}>Reset</Button>
                </ButtonGroup>

            </div>
        </aside>
    )
}

export default DoctorsFilter;