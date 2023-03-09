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

      <div className="border-t  mt-4 bg-[gray]/50">
        <div className="flex items-center justify-between max-w-[1150px] w-full mx-auto">
          <button
            onClick={() => setIsEditable(!isEditable)}
            className="p-2 bg-blue-500 rounded-md  text-white active:translate-y-[1px]"
          >
            {!isEditable ? "ערוך" : "שמור!"}
          </button>
          <h2 className="text-[72px] font-bold">הפרופיל שלי</h2>
        </div>

        <form
          className={`flex justify-center  p-5 ${
            !isEditable &&
            "bg-black/50 backdrop-blur-[7px] pointer-events-none cursor cursor-progress "
          }`}
          onSubmit={handleSubmit}
        >
          <section className=" w-[35%] flex flex-col items-start  mr-3 bg-black/40 p-4 rounded-2xl">
            <div className="flex justify-between text-[22px] text-white font-bold ">
              <h3 className="mr-3">Email Sign UP : </h3>
              <p className="text-white/50">{formData.email}</p>
            </div>
            <div className="flex justify-between text-[22px] text-white font-bold">
              <h3 className="mr-3">Email Verified status : </h3>
              {!formData.email_verified && (
                <p className="text-red-500">Please Go verified your emails</p>
              )}
              {formData.email_verified && (
                <p className="text-green-500">Email Is Verified</p>
              )}
            </div>
            <div className="text-white bg-orange-500 w-full">
              <p>{`${formData.first_name} joined Stutz ${daysAgo} days ago`}</p>
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

            <label className="text-lg text-[#656565]">Gender</label>
            <div className="onBoarding flex w-full items-start mb-4">
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
                className="border border-black/30 p-2 rounded-lg mr-2"
                htmlFor="man-gender-identity"
              >
                Man
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
                className="border border-black/30 p-2 rounded-lg mr-2"
                htmlFor="woman-gender-identity"
              >
                Woman
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
                className="border border-black/30 p-2 rounded-lg mr-2"
                htmlFor="more-gender-identity"
              >
                More
              </label>
            </div>

            <div className="flex items-center justify-center flex-row-reverse shadow-sm py-2 px-4 rounded-lg my-4">
              <label className="text-lg text-[#656565]" htmlFor="show-gender">
                Show Gender on my Profile
              </label>

              <input
                className=""
                id="show-gender"
                type="checkbox"
                name="show_gender"
                onChange={handleChange}
                checked={formData.show_gender}
              />
            </div>

            <label className="text-lg text-[#656565]">Show Me</label>

            <div className="onBoarding flex w-full items-start mb-4">
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
                className="border border-black/30 p-2 rounded-lg mr-2"
                htmlFor="man-gender-interest"
              >
                Man
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
                className="border border-black/30 p-2 rounded-lg mr-2"
                htmlFor="woman-gender-interest"
              >
                Woman
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
                className="border border-black/30 p-2 rounded-lg mr-2"
                htmlFor="everyone-gender-interest"
              >
                Everyone
              </label>
            </div>

            <label className="text-lg text-[#656565]" htmlFor="about">
              About me
            </label>
            <input
              className="border-2 border-black/30 p-2 rounded-lg w-full mb-3"
              id="about"
              type="text"
              name="about"
              required={false}
              placeholder="I like long walks..."
              value={formData.about}
              onChange={handleChange}
            />

            <input
              className="py-2 px-4 border border-black/30 rounded-lg my-4 transition-all cursor-pointer hover:bg-[rgb(235,235,235)] active:bg-[rgb(226,115,155)]"
              type="submit"
              value="Update Profile"
            />
          </section>

          <section className=" w-[35%] flex flex-col items-start  ml-3">
            <label className="text-lg text-[#656565]" htmlFor="url">
              Profile Photo
            </label>
            {/* <input
              className="border-2 border-black/30 p-2 rounded-lg w-full mb-3"
              type="url"
              name="url"
              id="url"
              placeholder="Image URL "
              onChange={handleChange}
              required={false}
            />
            <div className="max-w-[400px] mx-auto">
              {formData.url && (
                <img
                  className=" rounded-2xl shadow-sm"
                  src={formData.url}
                  alt="profile pic preview"
                />
              )}
            </div> */}

            <div className="">
              <ImageUploader
                images={formData.images}
                setFormData={setFormData}
              />
            </div>
          </section>
        </form>
      </div>
    </>
  );
};
export default OnBoarding;
