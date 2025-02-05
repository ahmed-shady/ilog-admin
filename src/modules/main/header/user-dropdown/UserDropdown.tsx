import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StyledBigUserImage, StyledSmallUserImage } from '@app/styles/common';
import {logout} from '@app/api/AuthService'
import {
  UserFooter,
  UserHeader,
  UserMenuDropdown,
} from '@app/styles/dropdown-menus';
import {} from '@app/index';
import { useAppDispatch, useAppSelector } from '@app/store/store';
import { setCurrentUser } from '@app/store/reducers/auth';
import { formatDate } from '@app/utils/DateUtil';

const UserDropdown = () => {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const dispatch = useAppDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logOut = async (event: any) => {
    logout();
    dispatch(setCurrentUser(null));
    event.preventDefault();
    setDropdownOpen(false);
  };

  const navigateToProfile = (event: any) => {
    event.preventDefault();
    setDropdownOpen(false);
    navigate('/profile');
  };

  return (
    <UserMenuDropdown isOpen={dropdownOpen} hideArrow>
      <StyledSmallUserImage
        slot="head"
        src={currentUser?.profileImage}
        fallbackSrc="/img/default-profile.png"
        alt="User"
        width={25}
        height={25}
        rounded
      />
      <div slot="body">
        <UserHeader className=" bg-primary">
          <StyledBigUserImage
            src={currentUser?.profileImage}
            fallbackSrc="/img/avatar.png"
            alt="User"
            width={90}
            height={90}
            rounded
          />
          <p>
            {currentUser?.name || currentUser?.email}
            <small>
              <span>Member since </span>
              {currentUser?.createdAt && (
                <span>
                  {formatDate(new Date(currentUser.createdAt))}
                </span>
              )}
            </small>
          </p>
        </UserHeader>
        {/* <UserBody>
          <div className="row">
            <div className="col-4 text-center">
              <Link to="/">{t('header.user.followers')}</Link>
            </div>
            <div className="col-4 text-center">
              <Link to="/">{t('header.user.sales')}</Link>
            </div>
            <div className="col-4 text-center">
              <Link to="/">{t('header.user.friends')}</Link>
            </div>
          </div>
        </UserBody> */}
        <UserFooter>
          <button
            type="button"
            className="btn btn-default btn-flat"
            onClick={navigateToProfile}
          >
            {t('header.user.profile')}
          </button>
          <button
            type="button"
            className="btn btn-default btn-flat float-right"
            onClick={logOut}
          >
            {t('login.button.signOut')}
          </button>
        </UserFooter>
      </div>
    </UserMenuDropdown>
  );
};

export default UserDropdown;
