import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../ContextApi/AuthContext';

const SiteUpdates = () => {
  const { backendURL } = useContext(AuthContext);
  
  // State for timeline updates and progress reports (combined)
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for photo gallery and lightbox
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  
  // State for comments and new comment input
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Format date in Indian format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Format time in 12-hour format
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format currency in INR with proper handling of undefined values
  const formatINR = (amount) => {
    const numericAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        console.error('No email found in localStorage');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backendURL}/api/progress/report?email=${email}`, {
          method: 'GET',
          headers: {
            "Content-type": "application/json",
            "token": localStorage.getItem('token')
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response:', result);

        // Process the response data
        if (result.data && Array.isArray(result.data)) {
          const reports = result.data.map(data => ({
            _id: data._id,
            title: data.title || "Progress Report",
            date: data.reportDate || new Date().toISOString(),
            description: data.description || "No description provided",
            supervisor: data.supervisor || "N/A",
            costIncurred: data.costIncurred || 0,
            photos: Array.isArray(data.photos) ? data.photos : []
          }));

          setUpdates(reports);

          // Process photos from all reports
          const allPhotos = result.data.flatMap(data => {
            if (Array.isArray(data.photos) && data.photos.length > 0) {
              return data.photos.map(photo => ({
                url: photo.path || photo.url || '',
                caption: photo.caption || "Site photo",
                date: data.reportDate || new Date().toISOString()
              }));
            }
            return [];
          });

          setPhotos(allPhotos);
        } else {
          console.warn('No data found in response:', result);
          setUpdates([]);
          setPhotos([]);
        }

        // Mock comments (replace with actual API call when available)
        const mockComments = [
          { 
            id: 1, 
            author: 'Client', 
            text: 'Great progress on the construction. Keep up the good work!', 
            date: new Date().toISOString(),
            avatar: 'C'
          },
          { 
            id: 2, 
            author: 'Site Supervisor', 
            text: 'Thank you! We\'re on schedule for the next milestone.', 
            date: new Date().toISOString(),
            avatar: 'S'
          }
        ];

        setComments(mockComments);
      } catch (error) {
        console.error('Error fetching site updates:', error);
        // Set empty arrays on error to prevent UI issues
        setUpdates([]);
        setPhotos([]);
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [backendURL]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      // TODO: Replace with actual API endpoint
      const mockComment = {
        id: comments.length + 1,
        author: 'Client',
        text: newComment,
        date: new Date().toISOString(),
        avatar: 'C'
      };
      
      setComments(prev => [...prev, mockComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    }
  };

  // Open lightbox with selected photo
  const openLightbox = (photo) => {
    if (!photo || !photo.url) return;
    setSelectedPhoto(photo);
    setShowLightbox(true);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Lightbox Modal */}
      {showLightbox && selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative max-w-4xl w-full max-h-screen">
            <button 
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.caption}
                className="w-full max-h-[80vh] object-contain"
              />
              <div className="p-3 bg-white">
                <p className="text-sm font-medium text-gray-800">{selectedPhoto.caption}</p>
                <p className="text-xs text-gray-500">{formatDate(selectedPhoto.date)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Site Updates</h1>
      
      {/* Timeline Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Project Timeline</h2>
        <div className="space-y-6">
          {updates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No updates available</p>
          ) : (
            updates.map((update) => (
              <div key={update._id} className="relative pl-6 pb-6 border-l-2 border-blue-200">
                {/* Timeline dot */}
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 top-1"></div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                  <h3 className="text-base sm:text-lg font-medium text-gray-800">{update.title}</h3>
                  <span className="text-xs sm:text-sm text-gray-500">{formatDate(update.date)}</span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                
                <div className="mt-2 text-xs sm:text-sm">
                  <span className="text-gray-500">Supervisor: </span>
                  <span className="font-medium text-gray-700">{update.supervisor}</span>
                </div>
                
                <div className="mt-1 text-xs sm:text-sm">
                  <span className="text-gray-500">Cost Incurred: </span>
                  <span className="font-medium text-gray-700">{formatINR(update.costIncurred)}</span>
                </div>
                
                {/* Photo thumbnails */}
                {update.photos?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {update.photos.map((photo, index) => (
                      <div 
                        key={index} 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden cursor-pointer hover:opacity-80"
                        onClick={() => openLightbox({ 
                          url: photo.path || photo, 
                          caption: photo.caption || 'Site photo', 
                          date: update.date 
                        })}
                      >
                        <img 
                          src={photo.path || photo} 
                          alt={`Update ${update._id} photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Photo Gallery Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Photo Gallery</h2>
        {photos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No photos available</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo, index) => (
              <div 
                key={index} 
                className="relative group cursor-pointer"
                onClick={() => openLightbox(photo)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.caption || `Site photo ${index + 1}`}
                  className="w-full h-32 sm:h-40 object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-md"></div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent rounded-b-md">
                  <p className="text-xs text-white truncate">{photo.caption}</p>
                  <p className="text-xxs text-gray-300">{formatDate(photo.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Comment Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Comments & Discussion</h2>
        
        {/* Comment List */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No comments yet</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                    comment.author.includes('Supervisor') 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {comment.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-baseline">
                      <h4 className={`text-sm font-medium ${
                        comment.author.includes('Supervisor') 
                          ? 'text-green-800' 
                          : 'text-blue-800'
                      }`}>
                        {comment.author}
                      </h4>
                      <span className="text-xxs text-gray-500">
                        {formatDate(comment.date)} at {formatTime(comment.date)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <div className="flex">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                C
              </div>
            </div>
            <div className="flex-1">
              <textarea
                rows="2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Add your comment..."
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteUpdates;
