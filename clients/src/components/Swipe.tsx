import { useState } from "react";
import TinderCard from "react-tinder-card";

type GenderedUser = {
  user_id: string;
  first_name: string;
  images: string[];
};

type SwipeProps = {
  filteredGenderedUsers?: GenderedUser[];
  swiped: (dir: string, userId: string) => void;
  outOfFrame: (firstName: string) => void;
};

const Swipe = ({ filteredGenderedUsers, swiped, outOfFrame }: SwipeProps) => {
  const [selectedImage, setSelectedImage] = useState<number | undefined>(
    undefined
  );

  return (
    <div className="swipe-container w-[70%] flex flex-col justify-center items-center h-[100vh]">
      <div className="card-container w-[400px] h-[650px]">
        {!filteredGenderedUsers || filteredGenderedUsers.length === 0 ? (
          <h1>There is No Ppl inside the DB</h1>
        ) : (
          filteredGenderedUsers.map((genderedUser: GenderedUser) => (
            <TinderCard
              className="swipe absolute"
              key={genderedUser.user_id}
              onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
              onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
            >
              <div
                style={{
                  backgroundImage: genderedUser.images
                    ? "url(" + genderedUser.images[selectedImage ?? 0] + ")"
                    : "",
                }}
                className="card w-[400px] h-[650px] rounded-[30px] bg-cover bg-no-repeat bg-center	"
              >
                <div className="flex flex-col items-center  absolute w-full bottom-0 text-white bg-black/50 backdrop-blur-[20px] rounded-2xl overflow-hidden">
                  <h3 className="">{genderedUser.first_name}</h3>

                  {genderedUser.images && (
                    <div className="image-gallery-container flex">
                      {genderedUser.images.map(
                        (image: string, index: number) => (
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
                  )}
                </div>
              </div>
            </TinderCard>
          ))
        )}
      </div>
    </div>
  );
};

export default Swipe;
