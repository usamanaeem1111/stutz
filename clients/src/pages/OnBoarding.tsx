import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import ImageUploader from "../components/ImageUploader";

const OnBoarding = () => {
  const [cookies] = useCookies(["AuthToken", "UserId"]);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    user_id: cookies.UserId,
    first_name: "",
    dob_day: "",
    dob_month: "",
    dob_year: "",
    show_gender: false,
    gender_identity: "man",
    gender_interest: "woman",
    images: [],
    url: "",
    about: "",
    matches: [],
    likes: [],
    email: "",
    email_verified: false,
    signUpDate: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user?userId=${cookies.UserId}`
        );

        console.log(cookies.UserId);
        const user = response.data;
        const userObject: any = jwt_decode(cookies.AuthToken);
        setFormData({
          user_id: cookies.UserId,
          first_name: user.first_name || userObject.given_name || "",
          dob_day: user.dob_day || "",
          dob_month: user.dob_month || "",
          dob_year: user.dob_year || "",
          show_gender: user.show_gender || false,
          gender_identity: user.gender_identity,
          gender_interest: user.gender_interest,
          url: user.url || userObject.picture || "",
          images: user.images || [],
          about: user.about || "",
          matches: user.matches || [],
          email: user.email,
          email_verified: user.email_verified,
          signUpDate: user.signUpDate,
          likes: user.likes,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchUserData();
  }, [cookies.AuthToken, cookies.UserId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log("formData ready to upload ", formData);
      const response = await axios.put(
        "http://localhost:8000/user",
        {
          formData,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.AuthToken}`,
          },
        }
      );
      const success = response.status === 200;
      console.log("success", success);
      setIsEditable(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: any) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const signUpDate = new Date(formData.signUpDate);
  const currentDate = new Date();
  const differenceInMs = currentDate.getTime() - signUpDate.getTime();
  const daysAgo = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  console.log(formData);
  return (
    <>
      <Navbar minimal={true} setShowModal={() => {}} showModal={false} />

      <div className="bg-[#F5F5F5] ">
        <div className="flex items-center justify-between max-w-[1150px] w-full mx-auto">
          {!isEditable && (
            <button
              onClick={() => setIsEditable(!isEditable)}
              className="p-2 bg-blue-500 rounded-md   active:translate-y-[1px]"
            >
              ערוך
            </button>
          )}
          <h2 className="text-[72px] font-bold">הפרופיל שלי</h2>
        </div>

        <form
          className={`flex text-[#100307] font-medium font-noto-sans text-base leading-6 text-right   max-w-[1150px] w-full mx-auto ${
            !isEditable &&
            "bg-black/50 backdrop-blur-[7px] pointer-events-none cursor cursor-progress"
          }`}
          onSubmit={handleSubmit}
        >
          <section className="w-[35%] flex flex-col items-center mr-3">
            <label className="text-4xl text-gray-600" htmlFor="url">
              הוסף תמונת פרופיל
            </label>
            <div className="">
              <ImageUploader
                images={formData.images}
                setFormData={setFormData}
              />
            </div>
          </section>

          <section className=" w-full flex flex-col items-start  ml-3 bg-white p-4 rounded-2xl">
            <div className="w-full ">
              <input
                type="submit"
                value="עדכן פרופיל"
                className="py-2 px-4 bg-gray-800 text-white rounded-lg my-4 transition-all cursor-pointer hover:bg-gray-700 active:bg-pink-600 float-right"
              />
            </div>
            <div className="flex justify-end w-full text-lg font-bold items-center">
              <p className="text-gray-500">{formData.email}</p>
              <h3 className="text-gray-700 font-medium ml-3">:נרשמת עם</h3>
            </div>
            <div className="flex justify-end w-full text-lg font-bold">
              {!formData.email_verified && (
                <p className="text-red-500">אנא אמת את האימייל שלך</p>
              )}
              {formData.email_verified && (
                <p className="text-green-500">האימייל מאומת</p>
              )}
              <h3 className="ml-3">:מצב אימות האימייל</h3>
            </div>
            <div className="bg-orange-500 w-full p-4 rounded-lg">
              <p className="text-white font-medium text-lg">
                {`${formData.first_name} הצטרף לסטוץ לפני ${daysAgo} ימים`}
              </p>
            </div>
            <div className="w-full text-right">
              <label htmlFor="first_name" className="text-lg text-[#656565]">
                שם
              </label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder=""
                className="border-2 border-[#E2E2E2] p-2 rounded-3xl w-full mt-1 text-right m-1"
              />
            </div>

            <div className="w-full text-right">
              <label className="text-lg text-[#656565]">גיל</label>
              <div className="flex w-full">
                <input
                  className="border-2 border-[#E2E2E2] p-2 rounded-3xl w-full mt-1 text-right m-1"
                  id="dob_day"
                  type="number"
                  name="dob_day"
                  placeholder="DD"
                  required={false}
                  min="1"
                  max="31"
                  value={formData.dob_day}
                  onChange={handleChange}
                />

                <input
                  className="border-2 border-[#E2E2E2] p-2 rounded-3xl w-full mt-1 text-right m-1"
                  id="dob_month"
                  type="number"
                  name="dob_month"
                  placeholder="MM"
                  required={false}
                  min="1"
                  max="12"
                  value={formData.dob_month}
                  onChange={handleChange}
                />

                <input
                  className="border-2 border-[#E2E2E2] p-2 rounded-3xl w-full mt-1 text-right m-1"
                  id="dob_year"
                  type="number"
                  name="dob_year"
                  placeholder="YYYY"
                  required={false}
                  min="1900"
                  max={`${new Date().getFullYear() - 18}`}
                  value={formData.dob_year}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-full text-right">
              <label className="text-lg text-[#656565]">מין</label>
              <div className="onBoarding flex w-full justify-end mb-4">
                <input
                  className=""
                  id="man-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="man"
                  onChange={handleChange}
                  checked={formData.gender_identity === "man"}
                />
                <label
                  className="border-2 border-[#E2E2E2] p-2 rounded-3xl min-w-[100px]  mt-1 text-center m-1 "
                  htmlFor="man-gender-identity"
                >
                  זכר
                </label>
                <input
                  className=""
                  id="woman-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="woman"
                  onChange={handleChange}
                  checked={formData.gender_identity === "woman"}
                />
                <label
                  className="border-2 border-[#E2E2E2] p-2 rounded-3xl min-w-[100px]  mt-1 text-center m-1 "
                  htmlFor="woman-gender-identity"
                >
                  נקבה
                </label>
                <input
                  className=""
                  id="more-gender-identity"
                  type="radio"
                  name="gender_identity"
                  value="more"
                  onChange={handleChange}
                  checked={formData.gender_identity === "more"}
                />
                <label
                  className="border-2 border-[#E2E2E2] p-2 rounded-3xl min-w-[100px]  mt-1 text-center m-1 "
                  htmlFor="more-gender-identity"
                >
                  חייזר
                </label>
              </div>
            </div>

            <div className="flex flex-row-reverse items-center w-full justify-between my-4 px-4 py-2 rounded-lg shadow-sm bg-gray-100">
              <label
                htmlFor="show-gender"
                className=" text-lg text-gray-600  ml-3"
              >
                הראה איזה מין אני
              </label>
              <input
                type="checkbox"
                id="show-gender"
                name="show_gender"
                checked={formData.show_gender}
                onChange={handleChange}
                className="ml-2 w-5 h-5 rounded-full bg-gray-300 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 "
              />
            </div>

            <div className="w-full text-right">
              <label className="text-lg text-[#656565]">מעוניין לראות</label>

              <div className="onBoarding flex w-full justify-end mb-4">
                <input
                  className=""
                  id="man-gender-interest"
                  type="radio"
                  name="gender_interest"
                  value="man"
                  onChange={handleChange}
                  checked={formData.gender_interest === "man"}
                />
                <label
                  className="border-2 border-[#E2E2E2] p-2 rounded-3xl min-w-[100px]  mt-1 text-center m-1 "
                  htmlFor="man-gender-interest"
                >
                  בחורים
                </label>
                <input
                  className=""
                  id="woman-gender-interest"
                  type="radio"
                  name="gender_interest"
                  value="woman"
                  onChange={handleChange}
                  checked={formData.gender_interest === "woman"}
                />
                <label
                  className="border-2 border-[#E2E2E2] p-2 rounded-3xl min-w-[100px]  mt-1 text-center m-1 "
                  htmlFor="woman-gender-interest"
                >
                  בחורות
                </label>
                <input
                  className=""
                  id="everyone-gender-interest"
                  type="radio"
                  name="gender_interest"
                  value="everyone"
                  onChange={handleChange}
                  checked={formData.gender_interest === "everyone"}
                />
                <label
                  className="border-2 border-[#E2E2E2] p-2 rounded-3xl min-w-[100px]  mt-1 text-center m-1 "
                  htmlFor="everyone-gender-interest"
                >
                  חייזרים
                </label>
              </div>
            </div>
            <div className="w-full text-right">
              <label
                htmlFor="about"
                className="text-lg text-gray-600 mt-4 block"
              >
                על עצמי
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="border-2 border-gray-300 p-2 rounded-lg w-full h-32 resize-none mb-3 block text-right"
                placeholder="...אני אוהב לטייל"
              ></textarea>
            </div>
          </section>
        </form>
      </div>
    </>
  );
};
export default OnBoarding;
