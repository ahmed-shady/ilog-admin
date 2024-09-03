import { Image } from '@profabric/react-components';

import './Loading.scss'

export const Loading = () => {
  return (
    
    <div className="preloader flex-column justify-content-center align-items-center">
      {/* <Image
        className="shake"
        src="/img/logo.JPG"
        alt="iLog logo"
        height={60}
        width={60}
      /> */}
      <div className="lds-dual-ring text-info"></div>
    </div>
  );
};
