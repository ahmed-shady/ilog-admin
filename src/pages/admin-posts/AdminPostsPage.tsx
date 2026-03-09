import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Loading } from '@app/components/loading/Loading';
import AdminPostsFilter from '@app/components/admin-posts-filter/AdminPostsFilter';
import AdminPostsTable from '@app/components/admin-posts-table/AdminPostsTable';
import AdminPostAdder, { AdminPostFormData } from '@app/components/admin-post-adder/AdminPostAdder';
import TablePagination from '@app/components/pagination/TablePagination';
import IButton from '@app/components/common/IButton';
import './AdminPostsPage.scss';
import AdminPostsFilterDto from '@app/types/AdminPostsFilterDto';
import { getLookups } from '@app/api/LookupService';
import { LookupType } from '@app/types/LookupType';
import { LookupDto } from '@app/types/LookupDto';
import { listCountries } from '@app/api/CountryService';
import { Country } from '@app/types/Country';
import Speciality from '@app/types/Speciality';
import { listSpecialites } from '@app/api/SpecialityService';
import { createAdminPost, searchAdminPosts } from '@app/api/AdminPostService';
import { CreateAdminPostRequest } from '@app/types/CreateAdminPostRequest';
import { AdminPostDto } from '@app/types/AdminPostDto';

const AdminPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<AdminPostDto[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageSize] = useState<number>(2);
  const [filterValues, setFilterValues] = useState<AdminPostsFilterDto>({});
  const [showAdder, setShowAdder] = useState<boolean>(false);
  const [typeOptions, setTypeOptions] = useState<LookupDto[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);

  useEffect(() => {
    getLookups(LookupType.ADMIN_POST).then((response) => {
      setTypeOptions(response);
    });
    listCountries().then((response) => {
      setCountries(response);
    });
    listSpecialites().then((response) => {
      setSpecialities(response);
    });
    loadData(0, {});
  }, []);

  const loadData = async (pageNumber: number, filters: AdminPostsFilterDto) => {
    setLoading(true);
    try {
      const response = await searchAdminPosts(filters, pageNumber, pageSize);
      setPosts(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setCurrentPage(pageNumber);
    } catch (err) {
      console.error('Error loading admin posts:', err);
      setPosts([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    loadData(pageNumber, filterValues);
  };

  const handleFilter = (values: AdminPostsFilterDto) => {
    setFilterValues(values);
    loadData(0, values);
  };

  const handleResetFilter = () => {
    setFilterValues({});
    loadData(0, {});
  };

  const handleAddPost = async (postData: AdminPostFormData) => {
    try {
      const request: CreateAdminPostRequest = {
        content: postData.description,
        type: postData.type,
        countriesIds: postData.countryIds,
        specialitiesIds: postData.specialityIds,
        filesIds: postData.filesIds
      };

      await createAdminPost(request);
      loadData(currentPage, filterValues);
    } catch (error: any) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="admin-posts-page">
      {isLoading && <Loading />}

      <Card className="admin-posts-card">
        <Card.Header className="admin-posts-header">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <div className="header-icon-wrapper">
                <i className="fas fa-bullhorn" />
              </div>
              <div className="ms-3">
                <h3 className="mb-0">Admin Posts Management</h3>
                <p className="text-muted mb-0 small">{totalElements} total posts</p>
              </div>
            </div>
            <div>
              <IButton
                variant="light"
                onClick={() => setShowAdder(true)}
                icon="fas fa-plus"
                text="Add Post"
                className="add-post-btn"
              />
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <AdminPostsFilter
            onFilter={handleFilter}
            onReset={handleResetFilter}
            initialValues={filterValues}
            specialities={specialities}
            countries={countries}
            typeOptions={typeOptions}
          />

          <AdminPostsTable
            currentPage={currentPage}
            pageSize={pageSize}
            posts={posts}
            typeOptions={typeOptions}
            onDeleteSuccess={() => loadData(currentPage, filterValues)}
          />
        </Card.Body>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          itemName="posts"
        />
      </Card>

      <AdminPostAdder
        show={showAdder}
        onHide={() => setShowAdder(false)}
        onSubmit={handleAddPost}
        specialities={specialities}
        countries={countries}
        typeOptions={typeOptions}
      />
    </div>
  );
};

export default AdminPostsPage;
