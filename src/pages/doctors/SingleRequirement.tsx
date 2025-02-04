import {useState, useEffect} from 'react';
import DocumentStatus from "@app/types/DocumentStatus";

const SingleRequirement = ({requirement, selectRequirement, selected}: any) => {

    const [imageErr, setImageErr] = useState(false);
    useEffect(() => {
        setImageErr(!requirement.document)
    }, []);
    return (
        <div onClick={() => {selectRequirement(requirement)}}
                    className={`position-relative ${selected?"active":""}`}
                    >
                      {(!requirement.document) && <i className="fas fa-question-circle text-secondary fa-2x"/>}
                      {(requirement.document?.verification?.status===DocumentStatus.PENDING) && <i className="fas fa-clock text-warning fa-2x"/>}
                      {(requirement.document?.verification?.status===DocumentStatus.REJECTED) && <i className="fas fa-times-circle text-danger fa-2x"/>}
                      {(requirement.document?.verification?.status===DocumentStatus.VERIFIED) && <i className="fas fa-check-circle text-success fa-2x"/>}

                      {imageErr && <img className='object-fit-contain border rounded' src="img/not-found.jpg"/>}
                      {!imageErr && requirement.document && <img className='object-fit-contain border rounded'
                          src={requirement.document.documentUrl}
                          onLoad={()=>{setImageErr(false);}}
                          onError={()=>{setImageErr(true)}}
                      />}
                      </div>
    );
}

export default SingleRequirement;