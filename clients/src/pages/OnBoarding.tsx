import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import jwt_decode from "jwt-decode";
import ImageUploader from "../components/ImageUploader";
import InputField from "../components/InputField";
import AgeCalculator from "../components/AgeCalculator";
import { RootState, useSelector } from "../store";
import ProfileCompletion from "../components/ProfileCompletion";
import envelopUnverifiedEmail from "./imgs/envelopUnverified.svg";
import envelopVerifiedEmail from "./imgs/envelopUnverifiedGreen.svg";
import joinTheAppIcon from "./imgs/joinTheAppIcon.svg";

const OnBoarding = ({ cookies, removeCookie, setCookie }: any) => {
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // SELECTORS
  const user = useSelector((state: RootState) => state.user.user);

  const [formData, setFormData] = useState(() => ({
    user_id: cookies.UserId,
    first_name: user?.first_name || "",
    dob_day: user?.dob_day || "",
    dob_month: user?.dob_month || "",
    dob_year: user?.dob_year || "",
    email_verified: user?.email_verified || "",
    dob: user?.dob || "",
    city: user?.city || "",
    show_gender: false,
    gender_identity: user?.gender_identity || "",
    gender_interest: user?.gender_interest || "",
    images: user?.images || [],
    url: user?.url || "",
    about: user?.about || "",
    matches: user?.matches || [],
    likes: user?.likes || [],
    email: user?.email || "",
    signUpDate: user?.signUpDate || "",
  }));

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      first_name: user?.first_name || "",
      dob_day: user?.dob_day || "",
      dob_month: user?.dob_month || "",
      dob_year: user?.dob_year || "",
      dob: user?.dob || "",
      email_verified: user?.email_verified || "",
      city: user?.city || "",
      gender_identity: user?.gender_identity || "",
      gender_interest: user?.gender_interest || "",
      images: user?.images || [],
      url: user?.url || "",
      about: user?.about || "",
      matches: user?.matches || [],
      likes: user?.likes || [],
      email: user?.email || "",
      signUpDate: user?.signUpDate || "",
    }));
  }, [user]);

  const handleSubmit = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      console.log("formData ready to upload ", formData);
      const response = await axios.put(
        "https://api.stutz.co.il/user",
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
      setIsLoading(false);
      localStorage.removeItem("formData");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e: any) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;

    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function getAge(dateOfBirth: any) {
    if (!dateOfBirth) {
      return;
    }
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  const signUpDate = new Date(formData.signUpDate);
  const currentDate = new Date();
  const differenceInMs = currentDate.getTime() - signUpDate.getTime();
  const daysAgo = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  if (!user) {
    return <span className="loader"></span>;
  }

  return (
    <>
      <Navbar
        formData={formData}
        minimal={true}
        setShowModal={() => {}}
        showModal={false}
        removeCookie={removeCookie}
        cookies={cookies}
      />

      <div className="bg-[#F5F5F5] ">
        <div className="flex items-center justify-center max-w-[1150px] w-full mx-auto">
          <h2 className="text-[72px] font-bold">הפרופיל שלי</h2>
        </div>

        <form
          className={`flex text-[#100307] font-medium font-noto-sans text-base leading-6 text-right   max-w-[1150px] w-full mx-auto backdrop-blur-[7px]`}
          onSubmit={handleSubmit}
        >
          <section
            className={`${
              !isEditable && " pointer-events-none  rounded-2xl mt-2"
            } w-full flex flex-col items-center mr-3 p-2 rounded-2xl`}
          >
            <label className="text-2xl text-[#100307] mb-2" htmlFor="url">
              {isEditable && "הוסף/עדכן תמונת פרופיל"}
            </label>
            <div className="">
              <ImageUploader
                saved={isEditable}
                images={formData.images}
                setFormData={setFormData}
                isEditable={isEditable}
              />
            </div>
          </section>

          <section className=" w-full flex flex-col items-start  ml-3  p-4 rounded-2xl">
            {/* Top section  */}

            {/* verify email section */}
            <div className="flex w-full justify-between bg-[#FFF6E8] p-1">
              <div className="flex  justify-between items-center">
                {isEditable ? (
                  <div
                    onClick={handleSubmit}
                    className="py-2 px-4 text-center rounded-2xl border border-black/20 cursor-pointer hover:bg-[#ff5b95] bg-[#100307] text-white transition-all active:translate-y-[1px]"
                  >
                    שמור שינויים
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditable(true)}
                    className="py-2 px-4 text-center rounded-2xl border border-black/20 transition-all active:translate-y-[1px] hover:bg-[#ff5b95] hover:text-white"
                  >
                    ערוך פרופיל
                  </button>
                )}
              </div>

              <div className="flex justify-end  items-center  ">
                {!formData.email_verified ? (
                  <div className="flex   mr-2 ">
                    <div className="mr-2">
                      <p className="font-semibold text-xl">
                        אנא אמת את האימייל שלך
                      </p>
                      <div className="flex text-[#FE316E] text-xl whitespace-no-wrap">
                        <p className="">{formData.email}</p>
                        <h3 className="font-medium ml-3 ">:נרשמת עם</h3>
                      </div>
                    </div>
                    <img
                      width={40}
                      src={envelopUnverifiedEmail}
                      alt="envelopUnverifiedEmail"
                    />
                  </div>
                ) : (
                  <div className="flex   mr-2 ">
                    <div className="mr-2">
                      <p className="font-semibold text-xl">!האמייל שלך מאומת</p>
                      <div className="flex text-[#00C853] text-xl whitespace-no-wrap">
                        <p className="">{formData.email}</p>
                        <h3 className="font-medium ml-3 ">:נרשמת עם</h3>
                      </div>
                    </div>
                    <img
                      width={40}
                      src={envelopVerifiedEmail}
                      alt="envelopUnverifiedEmail"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* user joined and profile progress */}
            <div className="flex items-center justify-between bg-[#FEF3F6] py-2">
              <ProfileCompletion formData={user} />
              <div className="px-1 py-3 rounded-lg w-[75%]">
                <p className="text-[#100307] font-medium text-lg">
                  {`${formData.first_name} הצטרף לסטוץ לפני ${daysAgo} ימים`}
                </p>
              </div>
              <img src={joinTheAppIcon} alt="joinTheAppIcon" />
            </div>

            <div className="w-full">
              <div className="w-full flex items-center justify-center my-2">
                {isLoading && <span className="loader"></span>}
              </div>
            </div>

            {/* name */}
            <div
              className={`${
                !isEditable && "pointer-events-none rounded-2xl mt-2"
              } w-full text-right p-2 m-1`}
            >
              {isEditable ? (
                <InputField
                  label="שם"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              ) : (
                <h2 className="text-4xl font-bold text-[42px]">
                  (
                  {formData.gender_identity === ""
                    ? "hey you"
                    : formData.gender_identity}
                  ) {formData.first_name}
                </h2>
              )}
            </div>

            {/* Date Of birth */}
            <div
              className={`${
                !isEditable &&
                "pointer-events-none rounded-2xl mt-2 flex w-full justify-start flex-row-reverse"
              } w-full text-right p-2 m-1`}
            >
              <label className="text-[#656565] w-[150px] text-2xl ">
                {isEditable ? "תאריך לידה" : ":גיל"}
              </label>
              {isEditable ? (
                <input
                  className="border-2 border-[#E2E2E2] p-2 rounded-3xl w-full mt-1 text-right m-1"
                  id="dob"
                  type="date"
                  name="dob"
                  required // added required prop
                  min="1900-01-01"
                  max={`${new Date().getFullYear() - 18}-12-31`}
                  value={formData.dob}
                  onChange={handleChange}
                />
              ) : (
                <p className="text-2xl">{getAge(formData.dob)}</p>
              )}
            </div>

            {/* city */}
            <div
              className={`${
                !isEditable &&
                "pointer-events-none rounded-2xl mt-2 flex w-full justify-start flex-row-reverse"
              } w-full text-right p-2 m-1`}
            >
              <label className="text-[#656565] w-[150px] text-2xl ">
                {isEditable ? "" : ":עיר"}
              </label>
              {isEditable ? (
                <InputField
                  label="עיר"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              ) : (
                <h2 className="font-bold text-2xl">{formData.city}</h2>
              )}
            </div>

            {/* about me */}
            <div
              className={`${
                !isEditable &&
                "pointer-events-none rounded-2xl mt-2  w-full justify-start flex-row-reverse"
              } w-full text-right p-2 m-1`}
            >
              <label
                htmlFor="about"
                className="text-2xl text-gray-600 mt-4 block mb-2"
              >
                {":על עצמי"}
              </label>
              {isEditable ? (
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  className="border-2 border-gray-300 p-2 rounded-lg w-full h-32 resize-none mb-3 block  text-right"
                  placeholder="...אני אוהב לטייל"
                ></textarea>
              ) : (
                <h2 className="text-xl">{formData.about}</h2>
              )}
            </div>

            <div
              className={`${
                !isEditable &&
                " pointer-events-none bg-[grey]/20 rounded-2xl mt-2"
              } w-full text-right p-2 m-1`}
            >
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
            <div
              className={`${
                !isEditable &&
                " pointer-events-none bg-[grey]/20 rounded-2xl mt-2"
              } w-full text-right p-2 m-1`}
            >
              <label className="text-lg text-[#656565]">מעוניין להכיר</label>

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
          </section>
        </form>
      </div>
    </>
  );
};
export default OnBoarding;
