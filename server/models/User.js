const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String ,

  date:{ type: String },
  type:String,
  post:[{ type: String }],
  selectedPost:String,

  fullName: String,
  nameWithInitials:String,

    driving_no: String,
    driving_no_issuing_date: String,
 
    province: String,
    district: String,
    divisional_secretariat: String,
    grama_niladhari_division: String,
    police_division: String,
    
    // Step 3 (education, etc. - placeholders if needed)
    
    ol: {
      firstAttempt: [{ subject: String, grade: String }],
      secondAttempt: [{ subject: String, grade: String }],
      thirdAttempt: [{ subject: String, grade: String}],
    },
    ol_index_1:Number,
    ol_index_2:Number,
    ol_index_3:Number,
    ol_year_1: String,
    ol_year_2: String,
    ol_year_3: String,

    al: {
      firstAttempt: [{ subject: String, grade: String }],
      secondAttempt: [{ subject: String, grade: String }],
      thirdAttempt: [{ subject: String, grade: String }],
    },
    al_index_1:Number,
    al_index_2:Number,
    al_index_3:Number,
    al_year_1:String,
    al_year_2:String,
    al_year_3:String,
    al_stream_1:String,
    al_stream_2:String,
    al_stream_3:String,


    schools_Attended: {entries:[ {name_of_school: String, 
      from: String, 
      to: String }]},

      
  university: {
  entries: [
    {
      Institute: { type: String, default: '' },
      type: { type: String, default: '' },
      year: { type: String, default: '' },
      class: { type: String, default: '' },
      date: { type: String, default: '' }
    }
  ]
},


    other_education:{entries:[{ institute: String, 
      course: String,
     from:String,
     to:String, 
     date:String }]},

    professional:{entries:[{ institute: String, 
      course: String,
      from:String,
      to:String, 
      date: String }]},

    sports:{entries:[{ activity: String, 
      year: String, 
      award: String }]},

    other: {entries:[{ qualification: String, 
      year: String }]},
    
  age: String,
  gender:String,
  dob: String,
  nic:String,
  height:String,
  chest:String,
  register_no:String,
  civilStatus: String,
  permanentAddress: String,
 
  telephoneLand: String,
  telephoneMobile: String,
  citizenship: String,
  ethnicGroup: String,

    // Step 4 (Work Experience)
      presentOccupation:{entries: [{ post: String, place: String, jobStatus: String, salaryScale: String, basicSalary: String}]},
      presentOccupation_date: String,

    postGrades:{entries: [{ grade: String, date: String}]},

    // Step 5 (Relevant Experience for the post)
    pastOccupation:{entries: [{ place: String, designation: String, from: String, to: String }]},

  verified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  isApproved: {
  type:Boolean,
  default: false,
},
  isFinal: {
  type: Boolean,
  default: false,
},
  isDeleted: {
  type: Boolean,
  default: false,
},
infoSuccess: { type: Boolean, default: false },
isSubmitted:{type:Boolean,default:false},

filePath: { type: String },
fileName: { type: String }



});

module.exports = mongoose.model('User', userSchema);
