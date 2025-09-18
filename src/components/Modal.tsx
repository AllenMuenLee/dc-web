import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  shortDescription?: string;
  imagePath?: string;
  category: string;
  productLink?: string;
  videoLink?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, description, imagePath, category, productLink, videoLink
}) => {
  if (!isOpen) return null;

  console.log('Modal videoLink:', videoLink);
  let youtubeVideoId = '';
  if (videoLink) {
    const youtubeWatchRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = videoLink.match(youtubeWatchRegex);
    if (match && match[1]) {
      youtubeVideoId = match[1];
      console.log('Extracted YouTube ID:', youtubeVideoId);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-[66vw] w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          &times;
        </button>
        {imagePath && (
          <div className="relative w-full h-60 mb-4 rounded-md overflow-hidden">
            <img src={imagePath} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <div className="flex justify-between items-start mb-4">
          <p className="text-gray-700 w-3/5">{description}</p>
          <div className="flex flex-col items-end space-y-2 w-2/5">
            {productLink && (
              <p className="text-gray-700 flex items-center">
                <strong>Product Link:</strong>
                <a href={productLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2 flex items-center">
                  {(() => {
                    try {
                      const url = new URL(productLink);
                      const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}`;
                      return (
                        <>
                          <img src={faviconUrl} alt="Favicon" className="w-4 h-4 mr-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          {url.hostname}
                        </>
                      );
                    } catch (e) {
                      return 'Link 🔗'; // Fallback for invalid URLs
                    }
                  })()}
                </a>
              </p>
            )}
            {videoLink && !youtubeVideoId && (
              <p className="text-gray-700">
                <strong>Video Link:</strong> <a href={videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{videoLink}</a>
              </p>
            )}
          </div>
        </div>
        {youtubeVideoId && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Video Preview:</h3>
            <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        )}
        <span className="inline-block bg-blue-200 text-blue-800 text-sm px-4 py-1 rounded-full uppercase font-semibold">
          {category}
        </span>
      </div>
    </div>
  );
};

export default Modal;

