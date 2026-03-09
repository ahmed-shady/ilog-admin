import React, { useState, useCallback } from 'react';
import { Modal, Table } from 'react-bootstrap';
import { deleteAdminPost } from '@app/api/AdminPostService';
import { AdminPostDto } from '@app/types/AdminPostDto';
import AdminPostRow from './AdminPostRow';
import IButton from '../common/IButton';
import './AdminPostsTable.scss';
import { LookupDto } from '@app/types/LookupDto';

interface Props {
  posts: AdminPostDto[];
  onDeleteSuccess: () => void;
  typeOptions: LookupDto[];
  currentPage: number;
  pageSize: number;
}

interface DeleteModalState {
  show: boolean;
  postId: number | null;
  processing: boolean;
}

const AdminPostsTable: React.FC<Props> = ({
  posts,
  onDeleteSuccess,
  typeOptions,
  currentPage,
  pageSize
}) => {

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    show: false,
    postId: null,
    processing: false
  });

  const openDeleteModal = useCallback((postId: number) => {
    setDeleteModal({
      show: true,
      postId,
      processing: false
    });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      show: false,
      postId: null,
      processing: false
    });
  }, []);

  const confirmDelete = async () => {
    if (!deleteModal.postId || deleteModal.processing) return;

    try {
      setDeleteModal(prev => ({ ...prev, processing: true }));

      await deleteAdminPost(deleteModal.postId);

      closeDeleteModal();
      onDeleteSuccess();
    } catch (error) {
      console.error('Failed to delete post:', error);
      setDeleteModal(prev => ({ ...prev, processing: false }));
    }
  };

  return (
    <div className="admin-posts-table">
      <h4 className="table-title px-2">Search Results</h4>
      <div className="table-responsive">
        <Table hover className="mb-0">

          <thead>
            <tr>
              <th style={{ width: '50px' }}>#</th>
              <th>Content</th>
              <th style={{ width: '120px' }}>Type</th>
              <th style={{ width: '150px' }}>Target</th>
              <th style={{ width: '120px' }}>Engagement</th>
              <th style={{ width: '150px' }}>Created At</th>
              <th className="sticky-actions" style={{ width: '100px' }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  No posts found
                </td>
              </tr>
            ) : (
              posts.map((post, index) => (
                <AdminPostRow
                  key={post.id}
                  post={post}
                  index={currentPage * pageSize + index + 1}
                  typeOptions={typeOptions}
                  onDelete={openDeleteModal}
                />
              ))
            )}
          </tbody>

        </Table>
      </div>

      <Modal show={deleteModal.show} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete this post?
        </Modal.Body>

        <Modal.Footer>

          <IButton
            variant="secondary"
            text="No"
            onClick={closeDeleteModal}
          />

          <IButton
            variant="danger"
            text="Yes, Delete"
            isLoading={deleteModal.processing}
            loadingText="Deleting..."
            onClick={confirmDelete}
          />

        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default AdminPostsTable;