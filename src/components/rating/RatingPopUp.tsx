import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  studentId: string;
}

const RatingPopup: React.FC<RatingPopupProps> = ({ isOpen, onClose, teacherId, studentId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  if (!isOpen) return null;

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      fetch("/api/rating", {
        method: "POST",
        body: JSON.stringify({rating: rating, teacherId: teacherId, studentId: studentId}),
      })
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-indigo-500 bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Rate Your Teacher</h2>
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer transition-colors ${
                (hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleStarClick(star)}
              fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
            />
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            onClick={handleSubmit}
            disabled={rating === 0}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingPopup;
