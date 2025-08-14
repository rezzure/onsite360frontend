import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../ContextApi/AuthContext";
import { toast } from "react-toastify";

// Mock data for initial state (to be replaced with API calls)
const initialQueryTypes = [
  "Material Related",
  "Supervisor Related",
  "Fund Related",
  "Design Related",
  "Labour Related",
];

const HelpDesk = () => {
  const { backendURL } = useContext(AuthContext);
  // const [clientId, setClientId] = useState('')

  // State for form data
  const [formData, setFormData] = useState({
    queryType: "",
    description: "",
    photos: [],
    adminResponse: "",
    clientReply: "",
  });

  // State for query types (including master data)
  const [queryTypes, setQueryTypes] = useState(initialQueryTypes);
  const [newQueryType, setNewQueryType] = useState("");

  // Toggle for showing/hiding Master Data Section (Query Type)
  const [showQueryType, setShowQueryType] = useState(false);

  // State for query history
  const [queryHistory, setQueryHistory] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);


  // Add new query type to master data
  const addQueryType = () => {
    if (newQueryType.trim() && !queryTypes.includes(newQueryType)) {
      setQueryTypes((prev) => [...prev, newQueryType]);
      setNewQueryType("");
    }
  };


  const fetchClientQueries = async () => {
  try {
    const clientId = localStorage.getItem('_id');
    console.log('Fetching queries for client:', clientId); // Debug log
    
    const response = await axios.get(
      `${backendURL}/api/queries/client/${clientId}`);
      // {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}` // Add if using auth
      //   }
      // }
   
    
    console.log('API Response:', response.data); // Debug log
    
    if (response.data && response.data.success) {
      // Ensure we're working with an array
      const queries = Array.isArray(response.data.data) ? response.data.data : [];
      console.log('Processed queries:', queries); // Debug log
      setQueryHistory(queries);
    } else {
      setQueryHistory([]);
      console.error(
        "Failed to fetch queries:",
        response.data?.message || "Unknown error"
      );
    }
  } catch (error) {
    console.error("Error fetching client queries:", error);
    toast.error(error.response?.data?.message || "Failed to fetch queries");
    setQueryHistory([]);
  }
};

  // // Fetch queries on component mount
  // React.useEffect(() => {
  //   fetchClientQueries();
  // }, [backendURL]);
  
  React.useEffect(() => {
  const clientId = localStorage.getItem('_id');
  if (clientId) {
    fetchClientQueries();
  } else {
    console.error('No client ID found in localStorage');
    toast.error('Please log in to view queries');
  }
}, [backendURL]); // Add clientId as dependency
  // UI state
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  // Remove photo from upload list
  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Submit the query form

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const clientId = localStorage.getItem("_id");
      if (!clientId) {
        toast.error("Client ID not found. Please log in again.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("clientId", clientId);
      formDataToSend.append("queryType", formData.queryType);
      formDataToSend.append("description", formData.description);

      // Append each photo file
      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

      const response = await axios.post(
        `${backendURL}/api/queries`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Query submitted successfully");
        await fetchClientQueries();
        resetForm();
      } else {
        throw new Error(response.data.message || "Failed to submit query");
      }
    } catch (error) {
      console.error("Failed to submit query:", error);
      toast.error(error.message || "Failed to submit query");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit client reply to admin response
  const handleClientReply = async (queryId) => {
    if (!formData.clientReply || !formData.clientReply.trim()) {
      toast.error("Reply message is required");
      return;
    }
    if (!queryId || typeof queryId !== "string" || !queryId.trim()) {
      toast.error("Invalid query ID");
      return;
    }
    setIsSubmitting(true);
    try {
      // API call to add client reply to conversation history (use PATCH and correct route)
      const response = await axios.patch(
        `${backendURL}/api/queries/${queryId}/reply`,
        { replyMessage: formData.clientReply }
      );
      if (response.data && response.data.success) {
        // Update selectedQuery and queryHistory with new communications
        setSelectedQuery((prev) => ({
          ...prev,
          communications: response.data.data.communications,
        }));
        setQueryHistory((prev) =>
          prev.map((q) => {
            const qid = q._id || q.id;
            return qid === queryId
              ? { ...q, communications: response.data.data.communications }
              : q;
          })
        );
        setFormData((prev) => ({ ...prev, clientReply: "" }));
        toast.success("Reply submitted successfully");
      }
    } catch (error) {
      console.error("Failed to submit reply:", error.message);
      toast.error("Failed to submit reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      queryType: "",
      description: "",
      photos: [],
      adminResponse: "",
      clientReply: "",
    });
  };

  // Ref for HelpDesk form container
  const formRef = React.useRef(null);

  // Load a query from history into the form and scroll to top
  const loadQuery = (query) => {
    setSelectedQuery(query);
    // Ensure photos are always an array of valid URLs (handle relative paths)

    // Normalize photos for display (handle string, url, path)
    let photos = Array.isArray(query.photos)
      ? query.photos
          .map((photo) => {
            // Normalize all backslashes to forward slashes for Windows paths
            const normalizeSlashes = (p) => p.replace(/\\/g, "/");
            if (typeof photo === "string") {
              if (!photo.trim()) return null;
              const norm = normalizeSlashes(photo);
              if (norm.startsWith("uploads/") || norm.startsWith("/uploads/")) {
                const relPath = norm.startsWith("/") ? norm.slice(1) : norm;
                return `${backendURL}/${relPath}`;
              }
              return norm;
            }
            if (photo instanceof File) return URL.createObjectURL(photo);
            if (photo && typeof photo === "object") {
              if (
                photo.url &&
                typeof photo.url === "string" &&
                photo.url.trim()
              ) {
                const norm = normalizeSlashes(photo.url);
                if (
                  norm.startsWith("uploads/") ||
                  norm.startsWith("/uploads/")
                ) {
                  const relPath = norm.startsWith("/") ? norm.slice(1) : norm;
                  return `${backendURL}/${relPath}`;
                }
                return norm;
              }
              if (
                photo.path &&
                typeof photo.path === "string" &&
                photo.path.trim()
              ) {
                const norm = normalizeSlashes(photo.path);
                if (
                  norm.startsWith("uploads/") ||
                  norm.startsWith("/uploads/")
                ) {
                  const relPath = norm.startsWith("/") ? norm.slice(1) : norm;
                  return `${backendURL}/${relPath}`;
                }
                return norm;
              }
            }
            return null;
          })
          .filter(Boolean)
      : [];

    console.log(photos);
    setFormData({
      queryType: query.queryType,
      description: query.description,
      photos,
      adminResponse: query.adminResponse || "",
      clientReply: query.clientReply || "",
    });
    setIsFormVisible(true);
    // Scroll to the form
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  // Format time as "X days ago" (handles string, number, or Date)
  const formatTimeAgo = (date) => {
    let d = date;
    if (typeof d === "string" || typeof d === "number") {
      d = new Date(d);
    }
    if (!(d instanceof Date) || isNaN(d.getTime())) return "";
    const seconds = Math.floor((new Date() - d) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1)
      return `${interval} year${interval === 1 ? "" : "s"} ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return `${interval} month${interval === 1 ? "" : "s"} ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? "" : "s"} ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return `${interval} hour${interval === 1 ? "" : "s"} ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} minute${interval === 1 ? "" : "s"} ago`;
    return "just now";
  };

  // Truncate description for display in history
  // Comment: Safely truncate description, handle undefined/null

  //The error is now fixed. The truncateDescription function in HelpDesk.jsx will safely
  //  handle cases where the input is undefined or not a string, preventing the
  // "Cannot read properties of undefined (reading 'length')" error.
  const truncateDescription = (text, length = 50) => {
    if (typeof text !== "string") return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  return (
    <div className="container mx-auto px-3">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Help Desk</h1>

      <div className="flex flex-col lg:flex-row gap-15">
        {/* Master Data Section - Left Side (hidden by default, toggled by button) */}
        {showQueryType && (
          <div className="w-full lg:w-1/2 bg-white p-2 rounded-lg shadow-md mb-4 lg:mb-0">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Add New Query Type :-
            </h2>
            <div className="flex gap-1">
              <input
                type="text"
                value={newQueryType}
                onChange={(e) => setNewQueryType(e.target.value)}
                placeholder="Enter new query type"
                className="flex-1 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:black-500"
              />
              <button
                onClick={addQueryType}
                className="px-4 py-2 border hover:bg-black hover:text-white transition-colors rounded-md"
              >
                Add
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2 ml-4">
                Available Query Types :-
              </h3>
              <ul className="space-y-2 " style={{ listStyleType: "circle" }}>
                {queryTypes.map((type, index) => (
                  <li key={index} className="text-gray-600 ml-10">
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4">
          {/* Toggle Show Query Type */}
          <button
            onClick={() => setShowQueryType((prev) => !prev)}
            className="px-2 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-bold"
          >
            {showQueryType
              ? "Hide Query Type"
              : "Do not find your query type ? "}
          </button>

          {/* Toggle Form Visibility Button */}
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="mb-4 px-2 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors ml-4 font-bold "
          >
            {isFormVisible ? "Hide Form" : "Show Form"}
          </button>

          {/* Help Desk Form */}
          {isFormVisible && (
            <div
              ref={formRef}
              className="bg-white p-6 rounded-lg shadow-md mb-8 border"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {selectedQuery ? "Query Details" : "Submit New Query"}
              </h2>

              <form onSubmit={handleSubmit}>
                {/* Query Type Dropdown */}
                <div className="mb-6">
                  <label
                    htmlFor="queryType"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Query Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="queryType"
                    name="queryType"
                    value={formData.queryType}
                    onChange={handleChange}
                    required
                    disabled={!!selectedQuery}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:black-500"
                  >
                    <option value="">Select a query type</option>
                    {queryTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description Textarea */}
                <div className="mb-6">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    disabled={!!selectedQuery}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:black-500"
                    placeholder="Please describe your query in detail..."
                  />
                </div>

                {/* Photo Upload */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Upload Photos {!selectedQuery && "(Optional)"}
                  </label>

                  {!selectedQuery ? (
                    <>
                      <input
                        type="file"
                        id="photos"
                        name="photos"
                        onChange={handlePhotoUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <label
                        htmlFor="photos"
                        className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
                      >
                        Choose Files
                      </label>
                      {/* Display selected photos */}
                      {formData.photos.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-600 mb-2">
                            Selected Photos:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {formData.photos.map((photo, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={
                                    photo instanceof File
                                      ? URL.createObjectURL(photo)
                                      : photo
                                  }
                                  alt={`Preview ${index + 1}`}
                                  className="h-20 w-20 object-cover rounded"
                                />
                                <button
                                  type="button"
                                  onClick={() => removePhoto(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(formData.photos) &&
                      formData.photos.length > 0 ? (
                        formData.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`Query photo ${index + 1}`}
                            className="h-20 w-20 object-cover rounded"
                          />
                        ))
                      ) : (
                        <p className="text-gray-500">
                          No photos uploaded with this query
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Conversation History (always from communications array) */}
                {selectedQuery &&
                  Array.isArray(selectedQuery.communications) && (
                    <div className="mb-6 bg-blue-50 p-4 rounded-md">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">
                        Conversation History
                      </h3>

                      {/* Scrollable chat container */}
                      <div className="max-h-60 overflow-y-auto mb-4 space-y-3 ">
                        {selectedQuery.communications.length > 0 ? (
                          selectedQuery.communications.map((comm, idx) => (
                            <div
                              key={idx}
                              className={`bg-white p-3 rounded-lg shadow-sm border-l-4 mb-4 ${
                                comm.sender === "admin"
                                  ? "border-blue-500"
                                  : "border-green-500"
                              } ${comm.sender === "client" ? "" : "ml-6"}`}
                            >
                              <p
                                className={`font-medium ${
                                  comm.sender === "admin"
                                    ? "text-blue-700"
                                    : "text-green-700"
                                }`}
                              >
                                {comm.sender === "admin" ? "Admin:" : "You:"}
                              </p>
                              <p className="text-gray-700 ">{comm.message}</p>
                              <span className="text-xs text-gray-400">
                                {comm.sentAt
                                  ? new Date(comm.sentAt).toLocaleString()
                                  : ""}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No conversation yet.</p>
                        )}
                      </div>

                      {/* Client Reply Form: only show if last message is from admin and query is not closed */}
                      {(() => {
                        if (
                          !selectedQuery.communications ||
                          selectedQuery.communications.length === 0
                        )
                          return null;
                        const lastComm =
                          selectedQuery.communications[
                            selectedQuery.communications.length - 1
                          ];
                        if (
                          lastComm.sender === "admin" &&
                          selectedQuery.status !== "closed"
                        ) {
                          return (
                            <div className="mt-4">
                              <label
                                htmlFor="clientReply"
                                className="block text-gray-700 font-medium mb-2"
                              >
                                Your Reply
                              </label>
                              <textarea
                                id="clientReply"
                                name="clientReply"
                                value={formData.clientReply}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Write your reply to the admin..."
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  handleClientReply(
                                    selectedQuery._id || selectedQuery.id
                                  );
                                }}
                                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                              >
                                Submit Reply
                              </button>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}

                {/* Submit Button (only for new queries) */}
                {!selectedQuery && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 hover:bg-black bg-white  text-black hover:text-white border rounded-md transition-colors disabled:bg-blue-400"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Query"}
                  </button>
                )}

                {/* Clear Selection Button (when viewing a query from history) */}
                {selectedQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedQuery(null);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Back to New Query
                  </button>
                )}
              </form>
            </div>
          )}

          {/* Query History Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Query History
            </h2>

            {queryHistory.length === 0 ? (
              <p className="text-gray-500">No queries submitted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Query
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {queryHistory.map((query, index) => (
                      <tr
                        key={index}
                        onClick={() => loadQuery(query)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {query.queryType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {truncateDescription(query.description)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimeAgo(query.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              query.status === "open"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {query.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDesk;
