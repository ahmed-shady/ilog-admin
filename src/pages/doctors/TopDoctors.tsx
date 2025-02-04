import './Doctors.scss'


const TopDoctors = ({ doctors }: any) => {

    return (
        <div className="row top-doctors-container justify-content-center align-items-center">
            {doctors.map((doctor: any, idx: number) =>
                <div key={idx} className="card user-card flex-row col-12 col-md-3 p-2">
                    <span className="badge-rank text-center">{idx+1}</span>
                    <img src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png" className="user-image" alt={`profile image of ${doctor.name}`} />
                    <div className="d-flex flex-column">
                        <h4 className="card-title">{doctor.name}</h4>
                        <p className="text-muted mb-0">Top Active User</p>
                    </div>
                </div>
            )}
        </div>


    )
}

export default TopDoctors;