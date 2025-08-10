import { useRef } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUserInfo } from '../context/UserInfoContext.jsx';
import Stepper from './Forms/Stepper.jsx';
// import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
//import './uor badge.jpg'

import '../index.css';

const PrintPage = ({ children, pageNumber, totalPages }) => (
  <div className="a4-page page-break text-base leading-relaxed font-[Times]">
    {children}
    <div className="print-footer">Page {pageNumber} of {totalPages}</div>
  </div>
);

function UserInfoPage() {
  const navigate = useNavigate();
  const { formData } = useUserInfo();
  const printRef = useRef();

  const handleSubmit = async () => {
    const element = printRef.current;
    if (!element) {
      toast.error('PDF content not ready.');
      return;
    }

    const opt = {
      margin: 0,
      filename: 'application_review.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        backgroundColor: "#fff", // Ensures white background
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
    // Ensure DOM is rendered before capture
    setTimeout(async () => {
      try {
        await html2pdf().set(opt).from(element).save();
        await axios.post('/auth/add-info', formData);
        toast.success('Info submitted!');
        navigate('/');
      } catch (err) {
        console.error(err.response?.data || err.message);
        toast.error('Failed to submit.');
      }
    }, 300);
  };

  const underlineField = (value, width = 'w-[30%]') => (
    <span
      className={`inline-block ml-2 ${width} underline-field`}
      style={{
        borderBottom: '1px solid black',
        lineHeight: '1.4em',
        paddingBottom: '2px',
        minHeight: '1.4em',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      {value || '\u00A0'}
    </span>
  );

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow p-6">
        <Stepper currentStep={5} />
        <h2 className="text-2xl font-bold text-center mb-6">Review Your Application</h2>

        <div ref={printRef} id="printable-form">
          {/* Page 1 */}
          <PrintPage pageNumber={1} totalPages={7}>
            <div className="text-center">
              <img src="/uor badge.jpg" alt="logo" className="mx-auto h-20" />
              <h2 className="font-bold text-xl uppercase">UNIVERSITY OF RUHUNA - MATARA</h2>
              <h3 className="text-base font-semibold">{formData.type?.toUpperCase()} APPLICATION FORM - FOR CANDIDATES</h3>
              <p className="mt-2 space-y-3 text-base font-semibold">
                Post: {formData.selectedPost?.toUpperCase()}
              </p>
              <p className="mt-2 space-y-3 text-base font-semibold">
                Advertisement Date: {formData.date}
              </p>
            </div>
            <hr className="my-4 border-black" />
            <div className="space-y-3 text-base">
              <p><strong>01. Full Name:</strong> {underlineField(formData.fullName)}</p>
              <p><strong>02. Name With Initials:</strong> {underlineField(formData.nameWithInitials)}</p>
              <p><strong>03. Title:</strong> {underlineField(formData.gender, 'w-40')}</p>
              <p><strong>04. Permanent Address:</strong> {underlineField(formData.permanentAddress)}</p>
              <p><strong>05. Telephone Numbers</strong> </p>
              <p className="ml-6"><strong>Land Line:</strong> {underlineField(formData.telephoneLand)}</p>
              <p className="ml-6"><strong>Mobile:</strong> {underlineField(formData.telephoneMobile)}</p>
              <p><strong>06. Date of Birth:</strong> {underlineField(formData.dob, 'w-40')}</p>
              <p><strong>Age on the closing date of Application:</strong> {underlineField(formData.age, 'w-40')}</p>
              <p><strong>07. National Identity Card No:</strong> {underlineField(formData.nic, 'w-40')}</p>
              {formData.post === 'Driver' && (
                <div>
                  <p><strong>Driving License, No:</strong> {underlineField(formData.driving_no, 'w-40')}</p>
                  <p><strong>Issuing Date:</strong> {underlineField(formData.driving_no_issuing_date, 'w-40')}</p>
                </div>
              )}
              {['Security Guard', 'Marshal', 'Security Inspector'].includes(formData.selectedPost) && (
                <div>
                  <p><strong>Height:</strong> {underlineField(formData.height, 'w-40')}</p>
                  <p><strong>Chest:</strong> {underlineField(formData.chest, 'w-40')}</p>
                </div>
              )}
              <p><strong>08. Civil Status:</strong> {underlineField(formData.civilStatus, 'w-40')}</p>
              <p><strong>09. Citizenship:</strong> {underlineField(formData.citizenship, 'w-40')}</p>
              {formData.citizenship === 'Registration' && (
                <div>
                  <p><strong>Registration Number:</strong> {underlineField(formData.register_no, 'w-40')}</p>
                </div>
              )}
              <p><strong>10. Ethnic Group:</strong> {underlineField(formData.ethnicGroup, 'w-40')}</p>
              <p><strong>11. Province:</strong> {underlineField(formData.province, 'w-40')}</p>
              <p><strong>12. District:</strong> {underlineField(formData.district, 'w-40')}</p>
              <p><strong>13. Divisional Secretariat:</strong> {underlineField(formData.divisional_secretariat, 'w-40')}</p>
              <p><strong>14. Grama Niladhari Division:</strong> {underlineField(formData.grama_niladhari_division, 'w-40')}</p>
              <p><strong>15. Police Division:</strong> {underlineField(formData.police_division, 'w-40')}</p>
            </div>
          </PrintPage>

          {/* Page 2 */}
          <PrintPage pageNumber={2} totalPages={7}>
            <hr className="my-4 border-black" />
            <h3 className="underline font-bold">16. EDUCATIONAL QUALIFICATIONS</h3>
            <p className="font-semibold mt-2"><strong>Schools Attendant</strong></p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Name of School</th><th className="border border-black">From</th>
                <th className="border border-black">To</th></tr></thead>
              <tbody>
                {formData.schools_Attended?.entries?.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.name_of_school}</td><td className="border border-black">{row.from}</td><td className="border border-black">{row.to}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="font-semibold mt-2"><strong>G.C.E. O/L - First Attempt</strong></p>
            <p><strong>Index No.:</strong> {underlineField(formData.ol_index_1, 'w-40')}</p>
            <p><strong>Year:</strong> {underlineField(formData.ol_year_1, 'w-40')}</p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Subject</th><th className="border border-black">Grade</th></tr></thead>
              <tbody>
                {formData.ol?.firstAttempt.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.subject}</td><td className="border border-black">{row.grade}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="font-semibold mt-4"><strong>G.C.E. O/L - Second Attempt</strong></p>
            <p><strong>Index No.:</strong> {underlineField(formData.ol_index_2, 'w-40')}</p>
            <p><strong>Year:</strong> {underlineField(formData.ol_year_2, 'w-40')}</p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Subject</th><th className="border border-black">Grade</th></tr></thead>
              <tbody>
                {formData.ol?.secondAttempt.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.subject}</td><td className="border border-black">{row.grade}</td></tr>
                ))}
              </tbody>
            </table>
          </PrintPage>

          {/* Page 3 */}
          <PrintPage pageNumber={3} totalPages={7}>
            <p className="font-semibold mt-4"><strong>G.C.E. O/L - Third Attempt</strong></p>
            <p><strong>Index No.:</strong> {underlineField(formData.ol_index_3, 'w-40')}</p>
            <p><strong>Year:</strong> {underlineField(formData.ol_year_3, 'w-40')}</p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Subject</th><th className="border border-black">Grade</th></tr></thead>
              <tbody>
                {formData.ol?.thirdAttempt.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.subject}</td><td className="border border-black">{row.grade}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="font-semibold mt-4"><strong>G.C.E. A/L - First Attempt</strong></p>
            <p><strong>Index No.:</strong> {underlineField(formData.al_index_1, 'w-40')}</p>
            <p><strong>Year:</strong> {underlineField(formData.al_year_1, 'w-40')}</p>
            <p><strong>Stream:</strong> {underlineField(formData.al_stream_1, 'w-40')}</p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Subject</th><th className="border border-black">Grade</th></tr></thead>
              <tbody>
                {formData.al?.firstAttempt.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.subject}</td><td className="border border-black">{row.grade}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="font-semibold mt-4"><strong>G.C.E. A/L - Second Attempt</strong></p>
            <p><strong>Index No.:</strong> {underlineField(formData.al_index_2, 'w-40')}</p>
            <p><strong>Year:</strong> {underlineField(formData.al_year_2, 'w-40')}</p>
            <p><strong>Stream:</strong> {underlineField(formData.al_stream_2, 'w-40')}</p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Subject</th><th className="border border-black">Grade</th></tr></thead>
              <tbody>
                {formData.al?.secondAttempt.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.subject}</td><td className="border border-black">{row.grade}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="font-semibold mt-4"><strong>G.C.E. A/L - Third Attempt</strong></p>
            <p><strong>Index No.:</strong> {underlineField(formData.al_index_3, 'w-40')}</p>
            <p><strong>Year:</strong> {underlineField(formData.al_year_3, 'w-40')}</p>
            <p><strong>Stream:</strong> {underlineField(formData.al_stream_3, 'w-40')}</p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Subject</th><th className="border border-black">Grade</th></tr></thead>
              <tbody>
                {formData.al?.thirdAttempt.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.subject}</td><td className="border border-black">{row.grade}</td></tr>
                ))}
              </tbody>
            </table>
          </PrintPage>

          {/* Page 4 */}
          <PrintPage pageNumber={4} totalPages={7}>
            <hr className="my-4 border-black" />
            <h3 className="font-bold">17.HIGHER & OTHER EDUCATIONAL QUALIFICATIONS</h3>
            <p><strong>University Education</strong> </p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Institute</th><th className="border border-black">Degree/Diploma</th>
                <th className="border border-black">Year</th><th className="border border-black">Class</th><th className="border border-black">Effective Date</th></tr></thead>
              <tbody>
                {formData.university?.entries?.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.Institute}</td><td className="border border-black">{row.type}</td>
                    <td className="border border-black">{row.year}</td><td className="border border-black">{row.class}</td><td className="border border-black">{row.date}</td></tr>
                ))}
              </tbody>
            </table>
            <p><strong>Other Education Qualifications</strong> </p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Institute</th><th className="border border-black">Course</th>
                <th className="border border-black">From</th><th className="border border-black">To</th>
                <th className="border border-black">Effective Date</th></tr></thead>
              <tbody>
                {formData.other_education?.entries?.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.institute}</td><td className="border border-black">{row.course}</td>
                    <td className="border border-black">{row.from}</td><td className="border border-black">{row.to}</td>
                    <td className="border border-black">{row.date}</td></tr>
                ))}
              </tbody>
            </table>
            <p><strong>Professional Qualifications</strong> </p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Institute</th><th className="border border-black">Course</th>
                <th className="border border-black">From</th><th className="border border-black">To</th>
                <th className="border border-black">Effective Date</th></tr></thead>
              <tbody>
                {formData.professional?.entries?.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.institute}</td><td className="border border-black">{row.course}</td>
                    <td className="border border-black">{row.from}</td><td className="border border-black">{row.to}</td>
                    <td className="border border-black">{row.date}</td></tr>
                ))}
              </tbody>
            </table>
          </PrintPage>

          {/* Page 5 */}
          <PrintPage pageNumber={5} totalPages={7}>
            <h3 className="font-bold">18.SPORT ACTIVITY</h3>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Activity</th><th className="border border-black">Year</th><th className="border border-black">Award</th></tr></thead>
              <tbody>
                {formData.sports?.entries?.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.activity}</td><td className="border border-black">{row.year}</td><td className="border border-black">{row.award}</td></tr>
                ))}
              </tbody>
            </table>
            <h3 className="font-bold">19.OTHER QUALIFICATIONS</h3>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Qualification</th><th className="border border-black">Year</th></tr></thead>
              <tbody>
                {formData.other?.entries?.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.qualification}</td><td className="border border-black">{row.year}</td></tr>
                ))}
              </tbody>
            </table>
            <hr className="my-4 border-black" />
            <h3 className="font-bold">20.EMPLOYMENT RECORDS</h3>
            <p><strong>Present Occupations</strong></p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Post</th><th className="border border-black">Place of Work</th>
                <th className="border border-black">Job Status</th><th className="border border-black">Salary Scale</th>
                <th className="border border-black">Basic</th></tr></thead>
              <tbody>
                {formData.presentOccupation?.entries?.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.post}</td><td className="border border-black">{row.place}</td>
                    <td className="border border-black">{row.jobStatus}</td><td className="border border-black">{row.salaryScale}</td>
                    <td className="border border-black">{row.basicSalary}</td></tr>
                ))}
              </tbody>
            </table>
            <br />
            <br />
            <p><strong>Date of got permanent of the above position:</strong> {underlineField(formData.presentOccupation_date, 'w-40')}</p>
            {formData.type === 'Internal' && (
              <div>
                <h3 className="font-bold">Grades in Above Post</h3>
                <table className="w-full border text-s">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border px-2">Date of Appointment</th>
                      <th className="border px-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.postGrades?.entries?.map((row, index) => (
                      <tr key={index}>
                        <td className="border px-2">{row.date}</td>
                        <td className="border px-2">{row.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </PrintPage>

          {/* Page 6 */}
          <PrintPage pageNumber={6} totalPages={7}>
            <p><strong>Past Occupations</strong></p>
            <table className="w-full border border-black text-center text-s my-2">
              <thead className="bg-gray-200"><tr><th className="border border-black">Place of Work</th><th className="border border-black">Designation</th>
                <th className="border border-black">From</th><th className="border border-black">To</th></tr></thead>
              <tbody>
                {formData.pastOccupation?.entries?.map((row, i) => (
                  <tr key={i}><td className="border border-black">{row.place}</td><td className="border border-black">{row.designation}</td>
                    <td className="border border-black">{row.from}</td><td className="border border-black">{row.to}</td></tr>
                ))}
              </tbody>
            </table>
            <br />
            <div className="mt-16">
              <hr className="my-4 border-black" />
                <p>
                  Application for the post of ...........................submitted by 
                  Mr./Mrs./Miss. ........................................ is forwarded herewith.
                  If he/she is selected for the said post he/she can/cannot be released.   <br/><br/>
                </p>
                <div>
                  {underlineField('', 'w-64')}<br/>
                  Signature of the Head of the institute
                </div>
                <br/><br/>
                <div>
                  Name:{underlineField('', 'w-64')}<br/>
                  Designation:{underlineField('', 'w-64')}<br/>
                  Date:{underlineField('', 'w-64')}<br/>
                  Seal:{underlineField('', 'w-64')}<br/>
                </div>
                <br /><br />
                <p><strong>Date: </strong>{underlineField('', 'w-64')}</p><br />
                <p><strong>Signature of Applicant: </strong> {underlineField('', 'w-64')}</p>
                <p>(N.B. When applying for several posts, each post should be applied for separately.)</p>
            </div>
          </PrintPage>

          {/* Page 7 */}
          <PrintPage pageNumber={7} totalPages={7}>
            <h3 className="font-bold">For Public Service/Corporations/Statutory Boards Candidates only.</h3>
            
            <div className="mt-16">
              <hr className="my-4 border-black" />
              <p>Application for the post of ...........................submitted by 
                Mr./Mrs./Miss. ........................................ is forwarded herewith.
                If he/she is selected for the said post he/she can/cannot be released.   <br/><br/>
                <p>
                {underlineField('', 'w-64')}<br/>
                Signature of the Head of the institute
              </p>
                <br/><br/>
               <p> Name:{underlineField('', 'w-64')}<br/>
                Designation:{underlineField('', 'w-64')}<br/>
                Date:{underlineField('', 'w-64')}<br/>
                Seal:{underlineField('', 'w-64')}<br/>
                
              </p>
              
              </p>
              <br /><br />
              <p><strong>Date: </strong>{underlineField('', 'w-64')}</p><br />
              <p><strong>Signature of Applicant: </strong> {underlineField('', 'w-64')}</p>
              <p>(N.B. When applying for several posts, each post should be applied for separately.)</p>
            </div>
          </PrintPage>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button onClick={() => navigate('/profile/form5')} className="bg-gray-400 text-white px-6 py-2 rounded w-full sm:w-auto hover:bg-gray-500">Back</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit & Download</button>
        </div>
      </div>
    </div>
  );
}

export default UserInfoPage;