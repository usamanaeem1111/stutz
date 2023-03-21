import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { HiOutlineX, HiOutlineHeart } from "react-icons/hi";
import axios from "axios";

interface Card {
  user_id: any;
  first_name: any;
  name: string;
  images: any[];
}

const Swipe = ({ cardData, user }: { cardData: Card[]; user: any }) => {
  const [cards, setCards] = useState(cardData);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [matches, setMatches] = useState<any>([]);

  const handleSwipe = async (direction: any) => {
    if (buttonsDisabled) {
      return; // Buttons are disabled, so ignore click
    }

    // Disable the buttons for a short period of time
    setButtonsDisabled(true);
    setTimeout(() => {
      setButtonsDisabled(false);
    }, 1000);

    // Remove the current card from the array and set the next card as current
    const newCards = [...cards];
    const currentCard = newCards[currentCardIndex];
    const nextCardIndex = currentCardIndex + 1;
    newCards.splice(currentCardIndex, 1);
    setCards(newCards);
    if (nextCardIndex === newCards.length) {
      setCurrentCardIndex(0);
    } else {
      setCurrentCardIndex(nextCardIndex);
    }

    // Send API request to record swipe
    const data = {
      user_id: user.user_id,
      corresponding_id: currentCard.user_id,
      direction: direction,
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/swipes`,
        data
      );
      if (response.data && response.data.matched_id) {
        // Match found, so update matches state
        setMatches((matches: any) => [
          ...matches,
          {
            user_id: response.data.user_id,
            corresponding_id: response.data.corresponding_id,
            matched_id: response.data.matched_id,
          },
        ]);

        // Display a notification to the user
        alert("You have a new match!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch matches for the user when component mounts
    const fetchMatches = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/matches/${user.user_id}`
        );
        setMatches(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMatches();
  }, [user.user_id]);

  return (
    <div className="relative w-full flex items-center justify-center h-screen max-w-[480px] ">
      {cards.length > 0 ? (
        cards.map((card: Card, index: number) => (
          <Transition
            key={card.user_id}
            show={index === currentCardIndex}
            enter="transition-all duration-500 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-all duration-500 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="p-4" key={card.user_id}>
              <div className="w-full mx-auto mt-10 rounded-lg bg-gradient-to-br from-black to-black/0 backdrop-blur-[7px] shadow-lg">
                <img
                  src={card.images[0]}
                  alt=""
                  className="w-full object-cover rounded-lg shadow-lg min-h-[480px]"
                />
                <div className="flex justify-between p-4">
                  <button
                    className="p-2 mx-2 text-white rounded-full hover:bg-black/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 active:translate-y-[1px]"
                    onClick={() => handleSwipe("left")}
                  >
                    <HiOutlineX size={36} />
                  </button>
                  <h2 className="mt-2 text-2xl font-medium text-white">
                    {card.first_name}
                  </h2>
                  <button
                    className="p-2 mx-2 text-green-500 rounded-full hover:bg-[#f8306f]/80 backdrop-blur-[7px] hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-600 active:translate-y-[1px]"
                    onClick={() => handleSwipe("right")}
                  >
                    <HiOutlineHeart size={36} />
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center">
          <img src="no-users-image.png" alt="No more users" />
          <p className="text-red">
            Sorry, there are no more users with the gender you are looking for
          </p>
        </div>
      )}
    </div>
  );
};

export default Swipe;
