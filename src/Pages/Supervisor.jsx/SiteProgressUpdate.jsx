import { useState, useRef, useContext, useEffect } from 'react';
import { FiUpload, FiX, FiCamera } from 'react-icons/fi';
import { AuthContext } from '../../ContextApi/AuthContext';

const SiteProgressUpdate = () => {
  const { backendURL } = useContext(AuthContext);
  const [sitedata, setSiteData] = useState([]);
  const [textData, setTextData] = useState({
    projectId: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [photos, setPhotos] = useState([]);
  const [progressHistory, setProgressHistory] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'No date available';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('en-US');
  };

  const getProjectsDetail = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await fetch(`${backendURL}/api/allortedSite?email=${email}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "token": localStorage.getItem("token")
        }
      });
      const result = await response.json();
      if (!result.success) {
        alert("Error: " + result.message);
        return;
      }
      setSiteData(result.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const getProgressDetails = async () => {
    const _id = localStorage.getItem("_id");
    try {
      const response = await fetch(`${backendURL}/api/getProgress/report/${_id}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "token": localStorage.getItem("token")
        },
      });
      const result = await response.json();
      if (result.success) {
        setProgressHistory(result.data);
      }
    } catch (error) {
      console.error("Error fetching progress details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTextData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 5) {
      alert("You can upload a maximum of 5 photos");
      return;
    }

    setIsUploading(true);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    
    setPhotos(prev => [...prev, ...newPhotos]);
    setIsUploading(false);
  };

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!textData.projectId) {
      alert("Please select a project");
      return;
    }
    
    if (!textData.description) {
      alert("Please enter a description");
      return;
    }
    
    if (photos.length === 0) {
      alert("Please upload at least one photo");
      return;
    }

    const formData = new FormData();
    formData.append('projectId', textData.projectId);
    formData.append('description', textData.description);
    formData.append('date', textData.date);
    
    photos.forEach((photo) => {
      formData.append('photos', photo.file);
    });

    const id = localStorage.getItem("_id");
    try {
      const response = await fetch(`${backendURL}/api/report/progress/${id}`, {
        method: "POST",
        headers: {
          "token": localStorage.getItem("token")
        },
        body: formData
      });
      
      const result = await response.json();
      if (!result.success) {
        alert(result.message);
        return;
      }

      // Update progress history with the new update
      const selectedProject = sitedata.find(project => project._id === textData.projectId);
      const newProgressItem = {
        ...result.data,
        siteName: selectedProject?.siteName || "Unknown Project",
      };
      
      setProgressHistory(prev => [newProgressItem, ...prev]);
      
      // Reset form
      setTextData({
        projectId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setPhotos([]);
      
      alert("Progress update submitted successfully");
    } catch (error) {
      console.error("Error submitting progress:", error);
      alert("Failed to submit progress update");
    }
  };

  useEffect(() => {
    getProjectsDetail();
    getProgressDetails();
  }, []);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, [photos]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Site Progress Update</h1>

      {/* Progress Update Form */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">New Progress Update</h2>

        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            {/* Project Selection */}
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                id="projectId"
                name="projectId"
                value={textData.projectId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Project</option>
                {sitedata.map(project => (
                  <option key={project._id} value={project._id}>{project.siteName}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={textData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Work Photos (Max 5)
            </label>

            <div className="flex flex-wrap gap-3 mb-3">
              {photos.map(photo => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.preview}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  disabled={isUploading}
                  className={`h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed rounded-md ${
                    isUploading ? 'border-gray-300 bg-gray-100' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
                  } transition-colors`}
                >
                  {isUploading ? (
                    <span className="text-sm text-gray-500">Uploading...</span>
                  ) : (
                    <>
                      <FiUpload className="text-blue-500 mb-1" size={20} />
                      <span className="text-xs text-gray-600">Add Photo</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
              accept="image/*"
              multiple
              disabled={photos.length >= 5}
            />

            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPG, PNG. Maximum file size: 5MB per photo.
            </p>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Progress Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={textData.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Describe today's progress, work completed, challenges faced, etc."
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit Progress Update
            </button>
          </div>
        </form>
      </div>

      {/* Progress History */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Progress History</h2>

        {progressHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No progress updates yet</p>
        ) : (
          <div className="space-y-4">
            {progressHistory.map((update, index) => (
              <div key={update._id || index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{update.siteName || "Unknown Project"}</h3>
                  <span className="text-sm text-gray-500">{formatDate(update.reportDate)}</span>
                </div>
                <p className="text-gray-700 mb-2">{update.description}</p>

                {update.photos && update.photos.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {update.photos.map((photo, idx) => (
                        <div key={idx} className="relative">
                          <a 
                            href={`${backendURL}/${photo.path.replace(/\\/g, '/')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                              {photo.path ? (
                                <img
                                  src={`${backendURL}/${photo.path.replace(/\\/g, '/')}`}
                                  alt={`Progress photo ${idx + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <FiCamera className="text-gray-400" />
                              )}
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteProgressUpdate;