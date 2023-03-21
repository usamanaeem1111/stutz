import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { HiOutlineX, HiOutlineHeart } from "react-icons/hi";

interface Card {
  user_id: any;
  first_name: any;
  name: string;
  images: any[];
}

const Swipe = ({ cardData }: { cardData: Card[] }) => {
  const [cards, setCards] = useState(cardData);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleSwipe = (direction: any) => {
    // remove the current card from the array and set the next card as current
    console.log("direction", direction);
    const newCards = [...cards];
    newCards.splice(currentCardIndex, 1);
    setCards(newCards);
    if (currentCardIndex === newCards.length) {
      setCurrentCardIndex(0);
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
