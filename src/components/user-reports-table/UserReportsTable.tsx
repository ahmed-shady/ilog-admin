import React, { useCallback, useMemo } from 'react';
import { Badge, ButtonGroup, Dropdown, DropdownButton, Table } from 'react-bootstrap';
import { UserReportDto, UserReportStatus } from '@app/types/UserReportDto';
import TablePagination from '@app/components/pagination/TablePagination';
import UserPreview from '@app/components/user-preview/UserPreview';
import './UserReportsTable.scss';
import { formatDate, formatDateTime } from '@app/utils/DateUtil';

interface UserReportsTableProps {
  reports: UserReportDto[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (pageNumber: number) => void;
  reasonOptions: Array<{ value: string; label: string }>;

}

const UserReportsTable: React.FC<UserReportsTableProps> = ({
  reports,
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  isLoading,
  onPageChange,
  reasonOptions
}) => {
  const getStatusBadge = (status: UserReportStatus) => {
    switch (status) {
      case UserReportStatus.PENDING:
        return <Badge bg="warning" className="status-badge">Pending</Badge>;
      case UserReportStatus.FALSE_REPORT:
        return <Badge bg="danger" className="status-badge">False Report</Badge>;
      case UserReportStatus.ACTION_TAKEN:
        return <Badge bg="success" className="status-badge">Action Taken</Badge>;
      default:
        return <Badge bg="secondary" className="status-badge">{status}</Badge>;
    }
  };

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   });
  // };

  const reasonsMap = useMemo(() => {
    return new Map(reasonOptions.map(option => [option.value, option.label]));
  }, [reasonOptions]);

  const getReportDetailsSummary = useCallback((report: UserReportDto) => {
    return report.details && report.details.length > 50 
      ? `${report.details.substring(0, 50)}...`
      : report.details
  }, []);

  return (
    <>
      <div className="table-responsive">
        <Table hover className="reports-table mb-0">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>#</th>
              <th style={{ width: '200px' }}>Reporter</th>
              <th style={{ width: '200px' }}>Reported</th>
              <th style={{ width: '150px' }}>Reported At</th>
              <th style={{ width: '150px' }}>Reason</th>
              <th style={{ width: '250px' }}>Message</th>
              <th style={{ width: '120px' }}>Status</th>
              <th className="sticky-actions" style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={report.id}>
                <td className="text-center">
                  {currentPage * pageSize + index + 1}
                </td>
                <td>
                  <UserPreview user={report.reporter} />
                </td>
                <td>
                  <UserPreview user={report.reported} />
                </td>
                <td>
                  <span className="report-date">{formatDateTime(new Date(report.createdAt))}</span>
                </td>
                <td>
                  <span className="reason-text">{reasonsMap.get(report.reasonCode) || report.reasonCode}</span>
                </td>
                <td>
                  <div className="message-cell" title={report.details}>
                    {getReportDetailsSummary(report)}
                  </div>
                </td>
                <td>
                  {getStatusBadge(report.status!)}
                </td>
                <td className="sticky-actions">
                  <ButtonGroup size="sm">
                    <DropdownButton
                      as={ButtonGroup}
                      title={<i className="fas fa-ellipsis-v"></i>}
                      id={`actions-${report.id}`}
                      variant="outline-secondary"
                      className="btn-more"
                    >
                      <Dropdown.Item>
                        <i className="fas fa-eye me-2"></i>
                        View Details
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <i className="fas fa-check me-2"></i>
                        Take Action
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <i className="fas fa-times me-2"></i>
                        Mark as False
                      </Dropdown.Item>
                    </DropdownButton>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {reports.length === 0 && !isLoading && (
          <div className="text-center py-5">
            <i className="fas fa-flag fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No reports found</h5>
            <p className="text-muted">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={pageSize}
        onPageChange={onPageChange}
        itemName="reports"
      />
    </>
  );
};

export default UserReportsTable;
