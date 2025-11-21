import React, { useState } from 'react';
import { BookmarkSimple, ShareNetwork } from 'phosphor-react';

interface ContentCardProps {
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isPremium?: boolean;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  content,
  difficulty,
  category,
  isPremium = false,
  onBookmark,
  isBookmarked = false,
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-100 text-red-700 border-red-200',
  };

  const difficultyLabels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: content,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 hover:shadow-lg transition-all duration-300 relative">
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-white">
            ⭐ Premium
          </span>
        </div>
      )}

      {/* Category & Difficulty */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {category}
        </span>
        <span className="text-gray-300">•</span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full border ${difficultyColors[difficulty]}`}
        >
          {difficultyLabels[difficulty]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-3 pr-12">{title}</h3>

      {/* Content */}
      <p className="text-gray-600 leading-relaxed mb-4">{content}</p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onBookmark}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
            ${
              isBookmarked
                ? 'bg-[#30358B] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <BookmarkSimple
            size={18}
            weight={isBookmarked ? 'fill' : 'regular'}
          />
          <span className="text-sm font-medium">
            {isBookmarked ? 'Saved' : 'Save'}
          </span>
        </button>

        <div className="relative">
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
          >
            <ShareNetwork size={18} />
            <span className="text-sm font-medium">Share</span>
          </button>

          {/* Share Menu (fallback for browsers without native share) */}
          {showShareMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${title}\n\n${content}`);
                  setShowShareMenu(false);
                  alert('Copied to clipboard!');
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Copy to clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;

