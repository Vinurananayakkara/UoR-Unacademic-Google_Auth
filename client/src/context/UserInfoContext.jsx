import React, { createContext, useContext, useState } from 'react';

const UserInfoContext = createContext();

export const useUserInfo = () => useContext(UserInfoContext);

export const UserInfoProvider = ({ children }) => {
   const [availableDates, setAvailableDates] = useState([]);
   const [availablePosts, setAvailablePosts] = useState([]);
   const [closingDate, setClosingDate] = useState('');
   
  const [formData, setFormData] = useState({
    // Step 1
    date:'',
    type: '',

    // Step 2
    
    fullName: '',
    nameWithInitials: '',
    gender: '',
    post:[''],
    selectedPost: '',
    permanentAddress: '',
    telephoneLand: '',
    telephoneMobile: '',
    dob: '',
    age: '',
    nic: '',

    driving_no: '',
    driving_no_issuing_date: '',
    height:'',
    chest:'',
    civilStatus: '',
    citizenship: '',
    register_no: '',
    ethnicGroup: '',

    province: '',
    district: '',
    divisional_secretariat: '',
    grama_niladhari_division: '',
    police_division: '',
    
    // Step 3 (education, etc. - placeholders if needed)
    
    ol: {
      firstAttempt: [{ subject: '', grade: '' }],
      secondAttempt: [{ subject: '', grade: '' }],
      thirdAttempt: [{ subject: '', grade: '' }],
    },
    ol_index_1:'',
    ol_index_2:'',
    ol_index_3:'',
    ol_year_1: '',
    ol_year_2: '',
    ol_year_3: '',

    al: {
      firstAttempt: [{ subject: '', grade: '' }],
      secondAttempt: [{ subject: '', grade: '' }],
      thirdAttempt: [{ subject: '', grade: '' }],
    },
    al_index_1:'',
    al_index_2:'',
    al_index_3:'',
    al_year_1:'',
    al_year_2:'',
    al_year_3:'',


    schools_Attended: [{ name_of_school: '', from: '', to: '' }],

    university: [{ institute: '', type: '', year: '', class: '', date: '' }],

    other_education:[{ institute: '', course: '',
     from:'',to:'', date: '' }],

    professional:[{ institute: '', course: '',
      from:'',to:'', date: '' }],

    sports:[{ activity: '', year: '', award: '' }],

    other: [{ qualification: '', year: '' }],
    

    // Step 4 (Work Experience)
      presentOccupation:[{ post: '', place: '', jobStatus: '', salaryScale: '', basicSalary: '' }],
      presentOccupation_date: '',

    postGrades: [{ grade: '', date: '' }],

    // Step 5 (Relevant Experience for the post)
    pastOccupation: [{ place: '', designation: '', from: '', to: '' }],

  //Admin specific data
  addPosts:[{ createddate: '', createdposts: [''] }],
  closingDate: '',
  setClosingDate:'',

  });


  return (
    <UserInfoContext.Provider value={{ 
      formData, 
      setFormData,
      availableDates,
      setAvailableDates,
      availablePosts,
      setAvailablePosts,
      closingDate, 
      setClosingDate,
         }}>
      {children}
    </UserInfoContext.Provider>
  );
};
