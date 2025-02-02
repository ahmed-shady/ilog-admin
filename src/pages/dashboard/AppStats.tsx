import { getApplicationStats } from '@app/api/StatisticsServic';
import { InfoBox } from '@app/components/info-box/InfoBox';
import ApplicationStats from '@app/types/ApplicationStats';
import { SmallBox } from '@components';
import {
    faEnvelope,
    faChartSimple,
    faUserPlus,
    faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';

const AppStats = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ApplicationStats | null>(null);

    useEffect(() => {
        getApplicationStats()
        .then(stats => setStats(stats))
        .finally(() => setLoading(false));
    }, []);
    return (
        <>
            <h4 className='m-2 font-weight-bold'>Application Stats</h4>
            <div className="row">
                <div className="col-lg-3 col-6">
                    <SmallBox
                        title="Registered Doctors"
                        text={stats?.registeredDoctors || '-'}
                        navigateTo="/doctors"
                        variant="warning"
                        icon={{
                            content: (
                                <FontAwesomeIcon
                                    icon={faUserPlus}
                                    style={{ fontSize: '62px' }}
                                />
                            ),
                        }}
                        loading={loading}
                    />
                </div>
                <div className="col-lg-3 col-6">
                    <SmallBox
                        title="Verified Doctors"
                        text={stats?.verifiedDoctors || '-'}
                        navigateTo="/doctors"
                        navigateOptions={{ state: { verified: true } }}
                        variant="success"
                        icon={{
                            content: (
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    style={{ fontSize: '62px' }}
                                />
                            ),
                            variant: 'success',
                        }}
                        loading={loading}
                    />
                </div>
                <div className="col-lg-3 col-6">
                    <SmallBox
                        title="Activities Logged"
                        text={stats?.loggedActivities || '0'}
                        navigateTo="#"
                        variant="danger"
                        icon={{
                            content: (
                                <FontAwesomeIcon
                                    icon={faChartSimple}
                                    style={{ fontSize: '62px' }}
                                />
                            ),
                        }}
                        loading={loading}
                    />
                </div>
                <div className="col-lg-3 col-6">
                    <SmallBox
                        title="New Messages"
                        text={stats?.newMessages || '0'}
                        navigateTo="/contactus-messages"
                        variant="info"
                        icon={{
                            content: (
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    style={{ fontSize: '62px' }}
                                />
                            ),
                        }}
                        loading={loading}
                    />
                </div>
            </div>
            {/* <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <InfoBox
              title="Messages"
              text="1,410"
              icon={{
                content: <FontAwesomeIcon icon={faEnvelope} />,
                variant: 'info',
              }}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <InfoBox
              variant="success"
              title="Messages"
              loading="dark"
              text="1,410"
              icon={{ content: <FontAwesomeIcon icon={faEnvelope} /> }}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <InfoBox
              variant="warning"
              title="Messages"
              text="1,410"
              icon={{ content: <FontAwesomeIcon icon={faEnvelope} /> }}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <InfoBox
              variant="danger"
              title="Messages"
              text="1,410"
              icon={{ content: <FontAwesomeIcon icon={faEnvelope} /> }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <InfoBox
              icon={{
                content: <FontAwesomeIcon icon={faBookmark} />,
                variant: 'info',
              }}
              title="Bookmarks"
              text="41,410"
              progressBar={{
                description: '70% Increase in 30 Days',
                level: 70,
                variant: 'success',
              }}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <InfoBox
              icon={{ content: <FontAwesomeIcon icon={faBookmark} /> }}
              variant="success"
              title="Bookmarks"
              text="41,410"
              progressBar={{
                description: '70% Increase in 30 Days',
                level: 70,
                variant: 'light',
              }}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <InfoBox
              icon={{ content: <FontAwesomeIcon icon={faBookmark} /> }}
              variant="warning"
              title="Bookmarks"
              text="41,410"
              loading
              progressBar={{
                description: '70% Increase in 30 Days',
                level: 70,
                variant: 'dark',
              }}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-sm-12">
            <InfoBox
              icon={{ content: <FontAwesomeIcon icon={faBookmark} /> }}
              variant="danger"
              title="Bookmarks"
              text="41,410"
              progressBar={{
                description: '70% Increase in 30 Days',
                level: 70,
                variant: 'light',
              }}
            />
          </div>
        </div> */}
        </>
    )
}

export default AppStats;