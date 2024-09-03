import EndpointConfig from "@app/types/EndpointConfig";


const endPoints: Record<string, EndpointConfig> = {
    "login": {
        url: `/auth/login`,
        method: "POST",
        requireBody: true,
        public: true,
        success: {
            toast: true,
            defaultMessage: "Login successful!"
        },
        error: {
            toast: true,
            defaultMessage: "Login failed!!"
        }
    },
    "listSpeciality": {
        url: `/specialities`,
        method: "GET",
        requireBody: false,
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed fetching specialities"
        }
    },
    "addSpeciality": {
        url: `/specialities`,
        method: "POST",
        requireBody: true,
        public: false,
        success: {
            toast: true,
            defaultMessage: "Speciality added sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while adding speciality"
        }
    },
    "updateSpeciality": {
        url: `/specialities/{id}`,
        method: "PUT",
        requireBody: true,
        public: false,
        success: {
            toast: true,
            defaultMessage: "Speciality updated sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while updating speciality"
        }
    },    
    "deleteSpeciality": {
        url: `/specialities/{id}`,
        method: "DELETE",
        public: false,
        success: {
            toast: true,
            defaultMessage: "Speciality deleted sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while deleting speciality"
        }
    },
    "listDocuments": {
        url: `/documents`,
        method: "GET",
        public: false,
        success: {
            toast: true,
            defaultMessage: "documents fetched successfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while fetching documents"
        } 
    },
    "changeDocumentVerification": {
        url: `/documents/{id}/verification`,
        method: "POST",
        public: false,
        requireBody: true,
        success: {
            toast: true,
            defaultMessage: "documents verification changed"
        },
        error: {
            toast: true,
            defaultMessage: "error while changing document verification"
        } 
    },
    "listRequirements": {
        url: `/requirements`,
        method: "GET",
        public: false,
        success: {
            toast: true,
            defaultMessage: "requirements fetched successfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while fetching requirements"
        } 
    },
    "addRequirement": {
        url: `/requirements`,
        method: "POST",
        requireBody: true,
        public: false,
        success: {
            toast: true,
            defaultMessage: "Requirement added sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while adding requirement"
        }
    },
    "updateRequirement": {
        url: `/requirements/{id}`,
        method: "PUT",
        requireBody: true,
        public: false,
        success: {
            toast: true,
            defaultMessage: "requirement updated sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while updating requirement"
        }
    },    
    "deleteRequirement": {
        url: `/requirements/{id}`,
        method: "DELETE",
        public: false,
        success: {
            toast: true,
            defaultMessage: "Requirement deleted sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while deleting requirement"
        }
    },
    "listDoctors": {
        url: `/doctors`,
        method: "GET",
        public: false,
        success: {
            toast: true,
            defaultMessage: "doctors fetched successfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while fetching doctors"
        } 
    },
    "verifyDoctor": {
        url: `/doctors/{id}/verify`,
        method: "POST",
        public: false,
        success: {
            toast: true,
            defaultMessage: "Successfully verified"
        },
        error: {
            toast: true,
            defaultMessage: "Error while Verifying this Doctor"
        } 
    },
    "unverifyDoctor": {
        url: `/doctors/{id}/unverify`,
        method: "POST",
        public: false,
        success: {
            toast: true,
            defaultMessage: "Successfully un-verified"
        },
        error: {
            toast: true,
            defaultMessage: "Error while un-Verifying this Doctor"
        } 
    },
    "getCountryByName": {
        url: `/countries/name/{name}`,
        method: "GET",
        public: false 
    },
    "deleteUser": {
        url: `/users/{id}`,
        method: "DELETE",
        public: false,
        success: {
            toast: true,
            defaultMessage: "user deleted sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while deleting user"
        }
    },
    "suspendUser": {
        url: `/users/suspend/{id}`,
        method: "POST",
        public: false,
        success: {
            toast: true,
            defaultMessage: "user suspended sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while suspending user"
        }
    },
    "unsuspendUser": {
        url: `/users/unsuspend/{id}`,
        method: "POST",
        public: false,
        success: {
            toast: true,
            defaultMessage: "user un-suspended sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while unsuspending user"
        }
    },
}

endPoints.login;

export default endPoints;