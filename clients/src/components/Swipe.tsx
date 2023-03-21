import React, { useState } from "react";
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

  const handleSwipe = async (direction: any) => {
    if (buttonsDisabled) {
      return; // Buttons are disabled, so ignore click
    }

    // Disable the buttons for a short period of time
    setButtonsDisabled(true);
    setTimeout(() => {
      setButtonsDisabled(false);
    }, 2000);
    // remove the current card from the array and set the next card as current
    console.log("direction", direction);
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
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative w-full flex items-center justify-center h-screen bg-gray-100">
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
            <div className="" key={card.user_id}>
              <div className="w-full  p-4 mx-auto mt-10 bg-white rounded-lg shadow-lg">
                <div className="flex justify-end">
                  <button
                    className="p-2 mx-2 text-gray-400 rounded-full hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    onClick={() => handleSwipe("left")}
                  >
                    <HiOutlineX size={24} />
                  </button>
                  <button
                    className="p-2 mx-2 text-gray-400 rounded-full hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    onClick={() => handleSwipe("right")}
                  >
                    <HiOutlineHeart size={24} />
                  </button>
                </div>
                <h2 className="mt-2 text-lg font-medium text-gray-800">
                  {card.first_name}
                </h2>
                <img src={card.images[0]} alt="" />
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
