import React from "react";

interface LectorCardProps {
  name: string;
  subjects: string[];
  description: string;
  image: string;
  lessons: number;
  rating: number;
}

const LectorCard: React.FC<LectorCardProps> = ({
  name,
  subjects,
  description,
  image,
  lessons,
  rating,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-4 w-full max-w-xs mx-auto">
      <img src={image} alt={name} className="rounded-2xl w-full object-cover h-60" />
      <div className="mt-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="flex gap-2 mt-2 flex-wrap">
          {subjects.map((subject, index) => (
            <span key={index} className="bg-pink-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {subject}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-700 mt-3">{description}</p>
        <div className="flex justify-between items-center border-t mt-4 pt-2">
          <span className="text-sm text-gray-600">{lessons} odučených lekcí</span>
          <div className="flex gap-[2px]">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectorCard;