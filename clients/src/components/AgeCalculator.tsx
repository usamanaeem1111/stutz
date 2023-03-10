interface AgeCalculatorProps {
  dob_day: string;
  dob_month: string;
  dob_year: string;
}

function AgeCalculator({ dob_day, dob_month, dob_year }: AgeCalculatorProps) {
  const calculateAge = () => {
    const birthdate = new Date(`${dob_year}-${dob_month}-${dob_day}`);
    const now = new Date();
    let age = now.getFullYear() - birthdate.getFullYear();
    const monthDifference = now.getMonth() - birthdate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && now.getDate() < birthdate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge();

  return <h2> {age}</h2>;
}

export default AgeCalculator;
