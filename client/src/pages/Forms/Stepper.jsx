
const steps = [
  'Personal Information',
  'Contact Details',
  'Educational Qualifications',
  'Present Work Experience',
  'Past Work Experience',
  'Review & Submit',
];

const Stepper = ({ currentStep }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={index} className="flex-1 flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
                ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' : isActive ? 'bg-white border-blue-600 text-blue-600' : 'border-gray-300 text-gray-400'}
              `}
            >
              {isCompleted ? '✓' : index + 1}
            </div>
            <div className="ml-2 text-sm text-gray-700">{label}</div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-gray-300 rounded">
                <div
                  className={`h-1 rounded ${isCompleted ? 'bg-blue-600' : 'bg-transparent'}`}
                  style={{ width: '100%' }}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
