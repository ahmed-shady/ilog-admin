import { Image } from '@profabric/react-components';

import './Loading.scss'
import { Spinner } from 'react-bootstrap';

export const Loading = ({transparent = false, customMessage}: {transparent?: boolean, customMessage?: string}) => {
  return (
    
    <div
    style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: `rgba(52, 58, 64, ${transparent?.3: .7})`,
      zIndex: 1000,
      gap: "10px"
    }}
  >
    <span style={{ color: "white" }}>
      {(customMessage !== undefined)? customMessage: 'Loading'}
    </span>
    <Spinner animation="border" role="status" variant="primary">
    </Spinner>
  </div>
  );
};
