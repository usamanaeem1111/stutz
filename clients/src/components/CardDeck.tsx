import { useState } from "react";

type CardProps = {
  imageUrl: any;
};

const Card = ({ imageUrl }: CardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img src={imageUrl} alt="" className="w-full h-64 object-cover" />
    </div>
  );
};

type CardDeckProps = {
  cards: CardProps[];
};

const CardDeck = ({ cards }: CardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-center">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <button
            className="bg-gray-800 text-white px-3 py-1 rounded-md"
            onClick={handlePrev}
          >
            &lt;
          </button>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <button
            className="bg-gray-800 text-white px-3 py-1 rounded-md"
            onClick={handleNext}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        {cards &&
          cards.map((card, index) => (
            <div
              key={index}
              className={`${
                index === currentIndex
                  ? "z-10"
                  : "opacity-0 pointer-events-none"
              } transition-opacity duration-300`}
            >
              <div
                className={`transform ${
                  index === currentIndex ? "scale-100" : "scale-90"
                } transition-transform duration-300`}
              >
                <Card imageUrl={card.imageUrl[0]} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CardDeck;
