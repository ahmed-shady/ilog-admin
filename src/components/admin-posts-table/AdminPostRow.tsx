import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { AdminPostDto } from '@app/types/AdminPostDto';
import { LookupDto } from '@app/types/LookupDto';
import { stripHtml, truncateText } from '@app/utils/TextUtil';

interface RowProps {
  post: AdminPostDto;
  index: number;
  typeOptions: LookupDto[];
  onDelete: (id: number) => void;
}

const AdminPostRow: React.FC<RowProps> = React.memo(
  ({ post, index, typeOptions, onDelete }) => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const plainText = stripHtml(post.content);
    const preview = truncateText(plainText, 150);
    
    const typeLabel = typeOptions.find(option => option.key === post.type)?.[currentLanguage === 'ar' ? 'valueAr' : 'valueEn'] || post.type;

    const hasCountries = post.countries?.length > 0;
    const hasSpecialities = post.specialities?.length > 0;

    return (
      <tr>
        <td className="text-center">
          {index}
        </td>

        <td>
          <div className="post-content">{preview}</div>

          {post.files?.length > 0 && (
            <div className="mt-1">
              <Badge bg="secondary">
                <i className="fas fa-paperclip me-1" />
                {post.files.length} file{post.files.length > 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </td>

        <td>
          <Badge bg="primary">{typeLabel}</Badge>
        </td>

        <td>
          {!hasCountries && !hasSpecialities && (
            <small className="text-muted">All</small>
          )}

          {hasCountries && (
            <div className="mb-1">
              <small className="text-muted">
                <i className="fas fa-globe me-1" />
                {post.countries!.length} countr
                {post.countries!.length > 1 ? 'ies' : 'y'}
              </small>
            </div>
          )}

          {hasSpecialities && (
            <div>
              <small className="text-muted">
                <i className="fas fa-stethoscope me-1" />
                {post.specialities!.length} specialt
                {post.specialities!.length > 1 ? 'ies' : 'y'}
              </small>
            </div>
          )}
        </td>

        <td>
          <div className="engagement-stats">
            <div>
              <i className="fas fa-heart text-danger me-1" />
              <small>{post.reactionsCount || 0}</small>
            </div>

            <div className="mt-1">
              <i className="fas fa-comment text-primary me-1" />
              <small>{post.commentsCount || 0}</small>
            </div>
          </div>
        </td>

        <td>
          <small>{new Date(post.createdAt).toLocaleString()}</small>
        </td>

        <td className="sticky-actions">
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(post.id)}
            aria-label="Delete post"
          >
            Delete
          </Button>
        </td>
      </tr>
    );
  }
);

export default AdminPostRow;