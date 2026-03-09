import EndpointConfig from "@app/types/EndpointConfig";


const endPoints: Record<string, EndpointConfig> = {
    "login": {
        url: `/auth/login`,
        method: "POST",
        requireBody: true,
        public: true,
        success: {
            toast: false,
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
    "getSpeciality": {
        url: `/specialities/{id}`,
        method: "GET",
        requireBody: true,
        public: false,
        success: {
            toast: false,
            defaultMessage: "Speciality updated sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while fetching speciality details"
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
    "addProcedures": {
        url: `/specialities/{id}/procedures`,
        method: "PUT",
        requireBody: true,
        public: false,
        success: {
            toast: false,
            defaultMessage: "Procedures sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while updating procedures"
        }
    },
    "getProcedures": {
        url: `/specialities/procedures`,
        method: "GET",
        requireBody: false,
        public: false,
        success: {
            toast: false,
            defaultMessage: "Procedures sucessfully"
        },
        error: {
            toast: true,
            defaultMessage: "error while fetching procedures"
        }
    },
    "listDocuments": {
        url: `/documents`,
        method: "GET",
        public: false,
        success: {
            toast: false,
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
            toast: false,
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
            toast: false,
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
    "getCountryByName": {
        url: `/countries/name/{name}`,
        method: "GET",
        public: false 
    },
    "listCountries": {
        url: `/countries`,
        method: "GET",
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to fetch countries list"
        }
    },
    "listCountryStates": {
        url: `/countries/{code}/states`,
        method: "GET",
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to fetch attached states"
        }
    },
    "searchDoctors": {
        url: `/doctors/search`,
        method: "POST",
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to fetch requested doctors data"
        }
    },
    "doctorsStatisticsPerCountry": {
        url: `/statistics/doctors-per-country`,
        method: "GET",
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to fetch doctors statistics per country"
        }
    },
    "doctorsStatisticsPerCountryState": {
        url: `/statistics/doctors-per-state`,
        method: "GET",
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to fetch doctors statistics per selected country state"
        }
    },
    "getApplicationStats": {
        url: `/statistics/app-stats`,
        method: "GET",
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to fetch Application stats"
        }
    },"getContactusMessages": {
        url: `/contactus`,
        method: "GET",
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to fetch messages from users"
        }
    },"deleteContactusMessage": {
        url: `/contactus/{id}`,
        method: "DELETE",
        public: false,
        success: {
            toast: true,
            defaultMessage: "Successfully deleted"
        },
        error: {
            toast: true,
            defaultMessage: "Failed to delete message"
        }
    },"markContactusMessageAsRead": {
        url: `/contactus/{id}/mark-as-read`,
        method: "PUT",
        public: false
    },
    "getNotifications": {
        url: `notifications`,
        method: "GET",
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to get your notifications"
        }
    },
    "markNotificationAsRead": {
        url: `notifications/{id}/mark-as-read`,
        method: "PUT",
        public: false
    },
    "markAllNotificationsAsRead": {
        url: `notifications/mark-all-as-read`,
        method: "PUT",
        public: false
    },
    "getSuggestions" : {
        url: `suggestions`,
        method: "GET",
        public: false
    },
    "getUserReports": {
        url: `user-reports/search`,
        method: "POST",
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to fetch user reports"
        }

    },
    "fetchLookups": {
        url: `lookups`,
        method: "GET",
        public: false
    },
    "createAdminPost": {
        url: `/admin-posts`,
        method: "POST",
        requireBody: true,
        public: false,
        success: {
            toast: true,
            defaultMessage: "Post created successfully"
        },
        error: {
            toast: true,
            defaultMessage: "Failed to create post"
        }
    },
    "searchAdminPosts": {
        url: `/admin-posts/search`,
        method: "POST",
        requireBody: true,
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to fetch admin posts"
        }
    },
    "deleteAdminPost": {
        url: `/admin-posts/{id}`,
        method: "DELETE",
        requireBody: false,
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to delete post"
        },
        success:{
            toast: true,
            defaultMessage: "Post deleted successfully"
        }
    },
    "generateUploadUrl": {
        url: `files/upload-request`,
        method: "POST",
        public: false,
        error: {
            toast: true,
            defaultMessage: "Failed to initiate file upload"
        }
    },
     "downloadFile": {
        url: `/files/download`,
        method: "GET",
        public: false,
        // responseType: "blob",
        error: {
            toast: true,
            defaultMessage: "Failed to downlod file"
        }
    },
}

endPoints.login;

export default endPoints;