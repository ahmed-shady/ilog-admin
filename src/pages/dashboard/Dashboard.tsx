import DoctorsMap from '@app/components/statistics/DoctorsMap';
import { ContentHeader } from '@components';
import AppStats from './AppStats';

const Dashboard = () => {
  return (
  
    <div>
      <ContentHeader title="Dashboard" />

      <section className="content">
        <div className="container-fluid">
          <h4 className='font-weight-bold'>Global View</h4>
        <DoctorsMap/>
        <hr/>
        <AppStats/>
      
      </div>
      
      </section>
    </div>
  );
};

export default Dashboard;
