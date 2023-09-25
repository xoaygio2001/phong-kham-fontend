// import axios from 'axios';
import axios from '../axios';

const handleLogin = (email, password) => {
    return axios.post('/api/login', { email: email, password: password });
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const createNewUserService = (data) => {
    return axios.post('/api/create-new-user',
        {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            positionId: data.positionId,
            roleId: data.roleId,
            avatar: data.avatar
        });
}

const deleteUserService = (inputId) => {
    return axios.delete('/api/delete-user', {
        data: { id: inputId }
    });
}

const editUserService = (data) => {
    return axios.put('/api/edit-user', { data });
}

const getAllCodeService = (typeInput) => {
    return axios.get(`/api/allcode?type=${typeInput}`);
}

const getTopDoctorHomeService = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
}

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctors`);
}

const saveDetailDoctorSevice = (data) => {
    return axios.post('/api/save-infor-doctors', data);
}

const getDetailInforDoctor = (inputId) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', data);
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data)
}

const postVerifyBookAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data)
}

const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data)
}

const getAllSpecialty = () => {
    return axios.get(`/api/get-specialty`)
}

const getAllClinic = () => {
    return axios.get(`/api/get-clinic`)
}

const getAllClinicByPageNumber = (limit,pageNumber) => {
    return axios.get(`/api/get-clinic-by-pagenumber?limit=${limit}&pageNumber=${pageNumber}`)
}


const getAllDetailSpecialtyById = (data) => {
    return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`);
}

const getAllDetailClinicById = (data) => {
    return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
}

const createNewClinic = (data) => {
    return axios.post('/api/create-new-clinic', data);
}

const getAllPatientForDoctor = (data) => {
    return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`);
}

const postSendRemedy = (data) => {
    return axios.post('/api/send-remedy', data);
}

const submitComment = (data) => {
    return axios.post('/api/submit-comment-by-email', data);
}

const getCommentByDoctorId = (doctorId) => {
    return axios.get(`/api/get-comment-by-doctorId?doctorId=${doctorId}`);
}

const getPatientByGmail = (gmail) => {
    return axios.get(`/api/get-patient-by-gmail?gmail=${gmail}`);
}

const postWarningPatient = (data) => {
    return axios.post('/api/post-warning-patient', data);
}

const postDeleteSchedule = (data) => {
    return axios.post('/api/post-Delete-Schedule', data)
}

const EditSpecialty = (data) => {
    return axios.post('/api/edit-specialty', data)
}

const DeleteSpecialty = (inputId) => {
    return axios.delete('/api/delete-specialty', {
        data: { id: inputId }
    });
}

const EditClinic = (data) => {
    return axios.post('/api/edit-clinic', data)
}

const DeleteClinic = (inputId) => {
    return axios.delete('/api/delete-clinic', {
        data: { id: inputId }
    });
}

const createNewHistory = (data) => {
    return axios.post('/api/crate-new-history', data);
}

const getPatientData = (patientId) => {
    return axios.get(`/api/get-patient-data-by-id?patientId=${patientId}`);
}

const createNewHandbook = (data) => {
    return axios.post('/api/create-new-handbook', data)
}

const getAllHandbook = () => {
    return axios.get(`/api/get-handbook`)
}

const getAllDetailHandbookById = (data) => {
    return axios.get(`/api/get-detail-handbook-by-id?id=${data.id}&location=${data.location}`);
}

const getAllDoctorVer2 = (limit,pageNumber) => {
    return axios.get(`/api/get-all-doctor-ver2?limit=${limit}&pageNumber=${pageNumber}`);
}

const getAllHandbookVer2 = (limit,pageNumber) => {
    return axios.get(`/api/get-all-handbook-ver2?limit=${limit}&pageNumber=${pageNumber}`);
}







export {
    handleLogin, getAllUsers,
    createNewUserService, deleteUserService,
    editUserService, getAllCodeService, getTopDoctorHomeService,
    getAllDoctors, saveDetailDoctorSevice,
    getDetailInforDoctor, saveBulkScheduleDoctor,
    getScheduleDoctorByDate, getExtraInforDoctorById,
    getProfileDoctorById, postPatientBookAppointment,
    postVerifyBookAppointment, createNewSpecialty,
    getAllSpecialty, getAllDetailSpecialtyById,
    createNewClinic,
    getAllClinic, getAllDetailClinicById,
    getAllPatientForDoctor, postSendRemedy,
    submitComment, getCommentByDoctorId, postWarningPatient,
    postDeleteSchedule, EditSpecialty, DeleteSpecialty,
    EditClinic, DeleteClinic, getPatientByGmail,
    createNewHistory, getPatientData, createNewHandbook,
    getAllHandbook, getAllDetailHandbookById,
    getAllClinicByPageNumber, getAllDoctorVer2,
    getAllHandbookVer2

}