import React from "react";

const ProgressBar = ({ percentCompleted }) => {
  const progressBarStyles = {
    height: "8px",
    width: "100%",
    backgroundColor: "#100307",
    borderRadius: "4px",
  };

  const progressBarFillStyles = {
    height: "100%",
    backgroundColor: percentCompleted < 100 ? "#FE316E" : "#00C853", // use different color for percentages less than 100
    borderRadius: "4px",
    width: `${percentCompleted}%`,
  };

  return (
    <div style={progressBarStyles}>
      <div style={progressBarFillStyles}></div>
    </div>
  );
};

const ProfileCompletion = ({ formData }) => {
  const totalFields = 14; // total number of fields in the form
  let filledFields = 0;

  // count the number of fields that have been filled out
  Object.keys(formData).forEach((key) => {
    const value = formData[key];
    if (value && !(Array.isArray(value) && value.length === 0)) {
      filledFields++;
    }
  });

  // calculate the percentage completed
  const completionPercentage = parseInt((filledFields / totalFields) * 100);

  return (
    <div className="w-64">
      <div className="text-xs text-[#100307] mb-1">
        {completionPercentage < 100 ? (
          <span>אנא השלם את פרופילך</span>
        ) : (
          <span>הפרופיל שלך הושלם בהצלחה</span>
        )}
        {` ${completionPercentage}% `}
      </div>
      <ProgressBar percentCompleted={completionPercentage} />
    </div>
  );
};

export default ProfileCompletion;
