import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useWindowSize } from '@app/hooks/useWindowSize';
import { calculateWindowSize } from '@app/utils/helpers';
import { setWindowSize } from '@app/store/reducers/ui';
import ReactGA from 'react-ga4';

import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import { setCurrentUser } from './store/reducers/auth';
import { useAppDispatch, useAppSelector } from './store/store';
import { Loading } from './components/loading/Loading';

// Lazy load all page components
const Main = lazy(() => import('@modules/main/Main'));
const Login = lazy(() => import('@modules/login/Login'));
const Register = lazy(() => import('@modules/register/Register'));
const ForgetPassword = lazy(() => import('@modules/forgot-password/ForgotPassword'));
const RecoverPassword = lazy(() => import('@modules/recover-password/RecoverPassword'));
const Dashboard = lazy(() => import('@app/pages/dashboard/Dashboard'));
const Specialities = lazy(() => import('@pages/specialities/Specialities'));
const SubMenu = lazy(() => import('@pages/SubMenu'));
const Profile = lazy(() => import('@pages/profile/Profile'));
const Requirements = lazy(() => import('./pages/requirements/Requirements'));
const Doctors = lazy(() => import('./pages/doctors/Doctors'));
const Messages = lazy(() => import('./pages/contactus/Messages'));
const UserReportsPage = lazy(() => import('./pages/user-reports/UserReportsPage'));
const AdminPostsPage = lazy(() => import('./pages/admin-posts/AdminPostsPage'));

const { VITE_NODE_ENV } = import.meta.env;

const App = () => {
  const windowSize = useWindowSize();
  const screenSize = useAppSelector((state) => state.ui.screenSize);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    let user = localStorage.getItem("user");
    let token  =localStorage.getItem("token");
    if(user && token){
      dispatch(setCurrentUser(JSON.parse(user)));
    }
    setIsAppLoading(false);

  }, []);

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);

  useEffect(() => {
    if (location && location.pathname && VITE_NODE_ENV === 'production') {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname,
      });
    }
  }, [location]);

  if (isAppLoading) {
    return <Loading />;
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Suspense fallback={<Loading />}><Login /></Suspense>} />
        </Route>
        <Route path="/register" element={<PublicRoute />}>
          <Route path="/register" element={<Suspense fallback={<Loading />}><Register /></Suspense>} />
        </Route>
        <Route path="/forgot-password" element={<PublicRoute />}>
          <Route path="/forgot-password" element={<Suspense fallback={<Loading />}><ForgetPassword /></Suspense>} />
        </Route>
        <Route path="/recover-password" element={<PublicRoute />}>
          <Route path="/recover-password" element={<Suspense fallback={<Loading />}><RecoverPassword /></Suspense>} />
        </Route>
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Main />}>
              <Route path="/sub-menu-2" element={<Specialities />} />
              <Route path="/sub-menu-1" element={<SubMenu />} />
              <Route path="/specialities" element = {<Specialities/>} />
              <Route path="/requirements" element = {<Requirements/>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/doctors" element={<Doctors/>}/>
              <Route path="/contactus-messages" element={<Messages />} />
              <Route path="/user-reports" element={<UserReportsPage/>}/>
              <Route path="/admin-posts" element={<AdminPostsPage/>}/>
              <Route path="/" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      <ToastContainer
        autoClose={3000}
        draggable={false}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
      />
    </>
  );
};

export default App;
