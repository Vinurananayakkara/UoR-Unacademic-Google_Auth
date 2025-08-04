import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../context/UserInfoContext.jsx'
import Stepper from './Stepper';
import { useState,useEffect } from 'react';
import axios from '../../axios.js';

const Form2 = () => {
  const navigate = useNavigate();
  const { formData, setFormData,availablePosts,closingDate,setClosingDate} = useUserInfo();
  
  
   useEffect(() => {
    const fetchClosingDate = async () => {
        try {
          const res = await axios.get('/admin/get-closing-date');
          setClosingDate(res.data.closingDate);
          console.log('Closing Date:', res.data.closingDate);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch closing date');
        }
      };
  
    
    fetchClosingDate();
  }, []);

  const handleNext = () => {
    // Validate required fields
    navigate('/profile/form3');
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <Stepper currentStep={1} />
        <h2 className="text-xl font-semibold mb-4 text-center">Step 1: Personal Information</h2>

        <label className="block mb-1">Full Name</label>
        <input
          type="text"
          value={formData.fullName || ''}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full" placeholder='--Vinura Nanayakkara--'
        />

        <label className="block mb-1">Name With Initials</label>
        <input
          type="text"
          value={formData.nameWithInitials || ''}
          onChange={(e) => setFormData({ ...formData, nameWithInitials: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full" placeholder='--V. Nanayakkara--'
        />

        <label className="block mb-1">Title</label>
        <select
          value={formData.gender || ''}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"
        >
          <option value="">-- Select --</option>
          <option value="Mr">Mr</option>
          <option value="Mrs">Mrs</option>
          <option value="Miss">Miss</option>
        </select>

        <label className="block mb-1">Select Your Intended Post</label>
        <select
          value={formData.selectedPost || ''}
          onChange={(e) => setFormData({ ...formData, selectedPost: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"
        >
         <option value="">-- Select --</option>
        {availablePosts.map((post, idx) => (
          <option key={idx} value={post}>
            {post}
          </option>
        ))}
          
        </select>


        {['Security Guard', 'Marshal', 'Security Inspector'].includes(formData.selectedPost)  && (
          <div>
            <label className="block mb-1">Height :</label>
              <input
                type="text"
                value={formData.height || ''}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="border px-4 py-2 rounded mb-3 w-full"
                placeholder='Feet:.........  Inches:.........' 
              />
              <label className="block mb-1">Chest :</label>
              <input
                type="text"
                value={formData.chest || ''}
                onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                className="border px-4 py-2 rounded mb-3 w-full"
                placeholder='Inches:.........' 
              />
          </div>
        )}


        <label className="block mb-1">Permanent Address</label>
        <input
          type="text"
          value={formData.permanentAddress || ''}
          onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"placeholder='--Permanent Address--'
        />

        <label className="block mb-1">Telephone Numbers</label>
        <label className="block mb-1">Land Line</label>
        <input
          type="text"
          value={formData.telephoneLand || ''}
          onChange={(e) => setFormData({ ...formData, telephoneLand: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"placeholder='--041 XXXXXXX--'
        />

        <label className="block mb-1">Mobile</label>
        <input
          type="text"
          value={formData.telephoneMobile || ''}
          onChange={(e) => setFormData({ ...formData, telephoneMobile: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full" placeholder='--077 XXXXXXX--'
        />
        <label className="block mb-1">Date of Birth</label>

        
        <input
          type="date"
          value={formData.dob || ''}
          onChange={(e) => {
            const dobValue = e.target.value;
            const birthDate = new Date(dobValue);

            if (!closingDate) {
              alert('Closing date not loaded yet.');
              return;
            }

            const closing = new Date(closingDate);

            let years = closing.getFullYear() - birthDate.getFullYear();
            let months = closing.getMonth() - birthDate.getMonth();

            if (closing.getDate() < birthDate.getDate()) {
              months--;
            }

            if (months < 0) {
              years--;
              months += 12;
            }

            const formattedAge = `${years} year${years !== 1 ? 's' : ''} and ${months} month${months !== 1 ? 's' : ''}`;

            setFormData({
              ...formData,
              dob: dobValue,
              age: formattedAge,
            });
          }}
          className="border px-4 py-2 rounded mb-3 w-full"
        />

        <label className="block mb-1">Age on the closing date of Application</label>
        <input
          type="text"
          value={formData.age || ''}
          readOnly
          className="border px-4 py-2 rounded mb-3 w-full"
        />

        <label className="block mb-1">National Identity Card No</label>
        <input
          type="text"
          value={formData.nic || ''}
          onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"
        />

        
        {formData.post === 'Driver' && (
          <div>
            <label className="block mb-1">Driving License, No</label>
              <input
                type="text"
                value={formData.driving_no || ''}
                onChange={(e) => setFormData({ ...formData, driving_no: e.target.value })}
                className="border px-4 py-2 rounded mb-3 w-full"
                placeholder='--DL No--' 
              />
              <label className="block mb-1">Issuing Date</label>
              <input
                type="text"
                value={formData.driving_no_issuing_date || ''}
                onChange={(e) => setFormData({ ...formData, driving_no_issuing_date: e.target.value })}
                className="border px-4 py-2 rounded mb-3 w-full"
                placeholder='--Issuing Date--' 
              />
          </div>
        )}

        <label className="block mb-1">Civil Status</label>
        <select
          value={formData.civilStatus || ''}
          onChange={(e) => setFormData({ ...formData, civilStatus: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"
        >
          <option value="">-- Select --</option>
          <option value="Married">Married</option>
          <option value="Unmarried">Unmarried</option>
          <option value="Widowed">Widowed</option>
          <option value="Divorced">Divorced</option>
          <option value="Separated">Separated</option>

        </select>

        <label className="block mb-1">Citizenship</label>
        <select
          value={formData.citizenship || ''}
          onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full"
        >
          <option value="">-- Select --</option>
          <option value="Descent">By Descent</option>
          <option value="Registration">By Registration</option>
        </select>
        {formData.citizenship === 'Registration' && (
          <div>
            <label className="block mb-1">Registration Number :</label>
              <input
                type="text"
                value={formData.register_no || ''}
                onChange={(e) => setFormData({ ...formData, register_no: e.target.value })}
                className="border px-4 py-2 rounded mb-3 w-full"
                placeholder='--Reg.No--' 
              />
            
          </div>
        )}

        <label className="block mb-1">Ethnic Group</label>
        <select
          value={formData.ethnicGroup || ''}
          onChange={(e) => setFormData({ ...formData, ethnicGroup: e.target.value })}
          className="border px-4 py-2 rounded mb-4 w-full"
        >
          <option value="">-- Select --</option>
          <option value="Sinhalese">Sinhalese</option>
          <option value="Tamils">Tamils</option>
          <option value="Moors">Moors</option>
          <option value="Burgher">Burgher</option>
        </select>

        <label className="block mb-1">Province</label>
        <select
          value={formData.province || ''}
          onChange={(e) => setFormData({ ...formData, province: e.target.value })}
          className="border px-4 py-2 rounded mb-4 w-full"
        >
          <option value="">-- Select --</option>
          <option value="Western">Western</option>
          <option value="Central">Central</option>
          <option value="Southern">Southern</option>
          <option value="Northern">Northern</option>
          <option value="Eastern">Eastern</option>
          <option value="North Western">North Western</option>
          <option value="North Central">North Central</option>
          <option value="Uva">Uva</option>
          <option value="Sabaragamuwa">Sabaragamuwa</option>
          
        </select>

        <label className="block mb-1">District</label>
        {formData.province ==='Western' && (
          <select
            value={formData.district || ''}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="border px-4 py-2 rounded mb-4 w-full"
          >
            <option value="">-- Select --</option>
            <option value="Colombo">Colombo</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kalutara">Kalutara</option>
          </select>
        )}
        {formData.province ==='Central' && (
          <select
            value={formData.district || ''}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="border px-4 py-2 rounded mb-4 w-full"
          >
            <option value="">-- Select --</option>
            <option value="Kandy">Kandy</option>
            <option value="Matale">Matale</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
          </select>
        )}
        {formData.province ==='Southern' && (
          <select
            value={formData.district || ''}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="border px-4 py-2 rounded mb-4 w-full"
          >
            <option value="">-- Select --</option>
            <option value="Galle">Galle</option>
            <option value="Matara">Matara</option>
            <option value="Hambantota">Hambantota</option>
          </select>
        )}
        {formData.province ==='Northern' && (
          <select
            value={formData.district || ''}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="border px-4 py-2 rounded mb-4 w-full"
          >
            <option value="">-- Select --</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Kilinochchi">Kilinochchi</option>
            <option value="Mannar">Mannar</option>
            <option value="Vavuniya">Vavuniya</option>
            <option value="Mullaitivu">Mullaitivu</option>
          </select>
        )}
        {formData.province ==='Eastern' && (
          <select
            value={formData.district || ''}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="border px-4 py-2 rounded mb-4 w-full"
          >
            <option value="">-- Select --</option>
            <option value="Trincomalee">Trincomalee</option>
            <option value="Batticaloa">Batticaloa</option>
            <option value="Ampara">Ampara</option>
          </select>
        )}
        {formData.province ==='North Western' && (
          <select
            value={formData.district || ''}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="border px-4 py-2 rounded mb-4 w-full"
          >
            <option value="">-- Select --</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Puttalam">Puttalam</option>
          </select>
        )}
        {formData.province ==='North Central' && (
          <select
            value={formData.district || ''}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="border px-4 py-2 rounded mb-4 w-full"
          >
            <option value="">-- Select --</option>
            <option value="Anuradhapura">Anuradhapura</option>
            <option value="Polonnaruwa">Polonnaruwa</option>
          </select>
        )}
        {formData.province ==='Uva' && (
          <select
            value={formData.district || ''}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="border px-4 py-2 rounded mb-4 w-full"
          >
            <option value="">-- Select --</option>
            <option value="Badulla">Badulla</option>
            <option value="Monaragala">Monaragala</option>
          </select>
        )}
        {formData.province ==='Sabaragamuwa' && (
          <select
            value={formData.district || ''}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="border px-4 py-2 rounded mb-4 w-full"
          >
            <option value="">-- Select --</option>
            <option value="Ratnapura">Ratnapura</option>
            <option value="Kegalle">Kegalle</option>
          </select>
        )}

        <label className="block mb-1">Divisional Secretariat</label>
        <input
          type="text"
          value={formData.divisional_secretariat || ''}
          onChange={(e) => setFormData({ ...formData, divisional_secretariat: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full" placeholder='--Divisional Secretariat--'
        />
        <label className="block mb-1">Grama Niladhari Division</label>
        <input
          type="text"
          value={formData.grama_niladhari_division || ''}
          onChange={(e) => setFormData({ ...formData, grama_niladhari_division: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full" placeholder='--Grama Niladhari Division--'
        />
        <label className="block mb-1">Police Division</label>
        <input
          type="text"
          value={formData.police_division || ''}
          onChange={(e) => setFormData({ ...formData, police_division: e.target.value })}
          className="border px-4 py-2 rounded mb-3 w-full" placeholder='--Police Division--'
        />
       
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            onClick={() => navigate('/profile/form1')}
            className="bg-gray-400 text-white px-6 py-2 rounded w-full sm:w-auto hover:bg-gray-500"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-6 py-2 rounded w-full sm:w-auto hover:bg-blue-700"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default Form2;
