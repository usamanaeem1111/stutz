import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import { useCookies } from "react-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [genderedUsers, setGenderedUsers] = useState<any>(null);
  const [lastDirection, setLastDirection] = useState();
  const [cookies, setCookie, removeCookie] = useCookies(["UserId"]);
  const [selectedImage, setSelectedImage] = useState<number | null>(0);

  const userId = cookies.UserId;

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/user", {
        params: { userId },
      });
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getGenderedUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/gendered-users", {
        params: { gender: user?.gender_interest },
      });
      setGenderedUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, [user]);

  const updateMatches = async (matchedUserId: any) => {
    try {
      await axios.put("http://localhost:8000/addmatch", {
        userId,
        matchedUserId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const swiped = (direction: any, swipedUserId: any) => {
    if (direction === "right") {
      updateMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name: any) => {
    console.log(name + " left the screen!");
  };

  const matchedUserIds = user?.matches
    .map(({ user_id }: any) => user_id)
    .concat(userId);

  const filteredGenderedUsers = genderedUsers?.filter(
    (genderedUser: any) => !matchedUserIds.includes(genderedUser.user_id)
  );

  return (
    <>
      <Navbar minimal={true} setShowModal={() => {}} showModal={false} />
      {user && (
        <div className="dashboard flex justify-between">
          <ChatContainer user={user} />
          <div className="swipe-container w-[70%] flex flex-col justify-center items-center h-[100vh]">
            <div className="card-container w-[400px] h-[650px]">
              {filteredGenderedUsers?.map((genderedUser: any) => (
                <TinderCard
                  className="swipe absolute"
                  key={genderedUser.user_id}
                  onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                  onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
                >
                  <div
                    style={{
                      backgroundImage:
                        "url(" + genderedUser.images[selectedImage ?? 0] + ")",
                    }}
                    className="card w-[400px] h-[650px] rounded-[30px] bg-cover bg-no-repeat bg-center	"
                  >
                    <div className="flex flex-col items-center  absolute w-full bottom-0 text-white bg-black/50 backdrop-blur-[20px] rounded-2xl overflow-hidden">
                      <h3 className="">{genderedUser.first_name}</h3>
                      <div className="image-gallery-container flex">
                        {genderedUser.images.map(
                          (image: any, index: number) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${genderedUser.first_name} ${index + 1}`}
                              className="image-gallery-item w-[100px] h-[100px] m-1 rounded-2xl"
                              onClick={() => setSelectedImage(index)}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </TinderCard>
              ))}
              <div className="swipe-info absolute bottom-0 p-[10px]">
                {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
