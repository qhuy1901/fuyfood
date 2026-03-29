import React, { useState } from 'react';

interface RateRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantImage: string;
}

const RateRestaurantModal: React.FC<RateRestaurantModalProps> = ({
  isOpen,
  onClose,
  restaurantName,
  restaurantImage
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const improvementTags = [
    "Not to my liking",
    "Small portion",
    "Incorrect/Missing items",
    "Not hygienic/safe",
    "Did not follow instructions",
    "Doesn't match the picture"
  ];

  const complimentTags = [
    "Delicious",
    "Filled up",
    "Affordable price"
  ];

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log({
      restaurantName,
      rating,
      selectedTags,
      comment
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setSelectedTags([]);
      setComment('');
      onClose();
    }, 2000);
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center my-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-4xl transition-all duration-200 transform ${
              (hoverRating || rating) >= star ? 'text-yellow-400 scale-110' : 'text-gray-300'
            }`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => {
              setRating(star);
              setSelectedTags([]); // Reset tags when rating changes threshold
            }}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {isSubmitted ? (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl text-green-600">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600">Your review for {restaurantName} has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={restaurantImage} 
                  alt={restaurantName}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">{restaurantName}</h2>
                  <p className="text-gray-500 text-sm">How was your meal?</p>
                </div>
              </div>

              {/* Stars */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 uppercase tracking-wider">Tap to Rate</p>
                {renderStars()}
              </div>

              {/* Dynamic Feedback Section */}
              {rating > 0 && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <h3 className="font-bold text-gray-900">
                    {rating <= 3 ? "What improvements would you like to see?" : "Send your compliment"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(rating <= 3 ? improvementTags : complimentTags).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className={`px-4 py-2 rounded-full text-sm transition-all duration-200 border ${
                          selectedTags.includes(tag)
                            ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Comment */}
                  <div className="mt-4">
                    <textarea
                      placeholder="Share more details about your experience..."
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none min-h-[100px]"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  {/* Photo Upload Placeholder */}
                  <div className="mt-4">
                    <label className="flex items-center gap-3 p-3 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/30 transition-all group">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-orange-100 transition-all">
                        <span className="text-xl text-gray-500 group-hover:text-orange-600">📷</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-700 group-hover:text-orange-700">Add photos</p>
                        <p className="text-xs text-gray-400">Up to 3 photos of your meal</p>
                      </div>
                      <input type="file" multiple className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rating === 0}
                  className={`flex-[2] px-6 py-3 rounded-2xl font-bold text-white transition-all shadow-lg ${
                    rating === 0 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:shadow-orange-200'
                  }`}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RateRestaurantModal;
