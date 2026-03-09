import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { UserReportDto } from '@app/types/UserReportDto';
import { Loading } from '@app/components/loading/Loading';
import UserReportsFilter from '@app/components/user-reports-filter/UserReportsFilter';
import UserReportsTable from '@app/components/user-reports-table/UserReportsTable';
import { UserReportFilterDto } from '@app/types/UserReportFilterDto';
import { searchUserReports } from '@app/api/UserReportService';
import { getLookups } from '@app/api/LookupService';
import { LookupType } from '@app/types/LookupType';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import './UserReportsPage.scss';

const UserReportsPage: React.FC = () => {
  const [reports, setReports] = useState<UserReportDto[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(15);
  const [filterValues, setFilterValues] = useState<UserReportFilterDto>({});
  const [reasonOptions, setReasonOptions] = useState<Array<{ value: string; label: string }>>([]);
  const { i18n } = useTranslation();

  useEffect(() => {
    loadReasonOptions();
    loadData(0, {});
  }, []);

  // Reload reason options when language changes
  useEffect(() => {
    loadReasonOptions();
  }, [i18n.language]);

  const loadReasonOptions = async () => {
    try {
      const lookups = await getLookups(LookupType.REPORT_USER, true);
      const currentLanguage = i18n.language;
      
      // Map lookups to options based on current language
      const options = lookups.map(lookup => ({
        value: lookup.key,
        label: currentLanguage === 'ar' ? lookup.valueAr : lookup.valueEn
      }));
      
      setReasonOptions(options);
    } catch (error: any) {
      console.error('Error loading reason options:', error);
      toast.error('Failed to load reason options.');
    }
  };

  const loadData = async (pageNumber: number, filters: UserReportFilterDto) => {
    setLoading(true);
    
    try {
      const response = await searchUserReports(filters, pageNumber, pageSize);
      
      setReports(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(pageNumber);
    } catch (error: any) {
      console.error('Error loading user reports:', error);
      toast.error(error?.message || 'Failed to load user reports. Please try again.');
      
      // Set empty data on error
      setReports([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    loadData(pageNumber, filterValues);
  };

  const handleFilter = (values: UserReportFilterDto) => {
    setFilterValues(values);
    loadData(0, values); // Reset to first page when filtering
  };

  const handleResetFilter = () => {
    const emptyFilters: UserReportFilterDto = {};
    setFilterValues(emptyFilters);
    loadData(0, emptyFilters);
  };

  return (
    <div className="user-reports-page">
      {isLoading && <Loading />}
      
      <Card className="reports-main-card">
        <Card.Header className="reports-header">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <div className="header-icon-wrapper">
                <i className="fas fa-flag"></i>
              </div>
              <div className="ms-3">
                <h3 className="mb-0">User Reports Management</h3>
                <p className="text-muted mb-0 small">{totalElements} total reports</p>
              </div>
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
            <UserReportsFilter
              onFilter={handleFilter}
              onReset={handleResetFilter}
              initialValues={filterValues}
              reasonOptions={reasonOptions}
            />
          <UserReportsTable
            reports={reports}
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            reasonOptions={reasonOptions}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserReportsPage;
