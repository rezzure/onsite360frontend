import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../ContextApi/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const QuerySupport = () => {
  // State for photo modal
  const [modalPhoto, setModalPhoto] = useState(null);
  const closeModal = () => setModalPhoto(null);
  const { backendURL } = useContext(AuthContext);

  // State for form data
  const [formData, setFormData] = useState({
    queryType: "",
    description: "",
    photos: [],
    adminResponse: "",
    clientResponse: "",
    isClosed: false,
  });

  // State for queries and UI
  const [queries, setQueries] = useState();
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Comment: Fetch all queries from backend API
  const fetchAllQueries = async () => {
    try {
      // Comment: In production, we would call the actual API endpoint
      const response = await axios.get(`${backendURL}/api/all-quaries`);
      console.log(response.data);
      if (response.data && response.data.success) {
        setQueries(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching queries:", error.message);
      toast.error("Failed to load queries");
    }
  };

  // Comment: Send notification to client
  const sendNotification = async (clientId, message) => {
    try {
      // Comment: API call to send notification would go here
      await axios.post(`${backendURL}/api/notifications`, {
        recipient: clientId,
        message,
        // type: 'query-response'
      });
      setNotifications((prev) => [
        ...prev,
        { clientId, message, timestamp: new Date() },
      ]);
      toast.success("Notification sent to client");
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchAllQueries();
  }, [backendURL]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // The code automatically normalizes Windows-style paths and prepends your backend URL,
  //  so images load regardless of slashes or relative paths in the database.
  // No further action is needed.
  // Handle query selection from the list
  // Normalize photo paths for display
  const normalizePhotos = (photos) => {
    if (!Array.isArray(photos)) return [];
    return photos.filter(Boolean).map((photo) => {
      if (typeof photo !== "string") return "";
      let normalized = photo.replace(/\\/g, "/");
      // If already a full URL, return as is
      if (/^https?:\/\//i.test(normalized)) return normalized;
      // Prepend backendURL if not already
      if (normalized.startsWith("/")) normalized = normalized.slice(1);
      return `${backendURL}/${normalized}`;
    });
  };

  // corect hai
  //query is a document
  const handleSelectQuery = (query) => {
    setSelectedQuery(query);
    setFormData({
      queryType: query.queryType,
      description: query.description,
      photos: normalizePhotos(query.photos),
      adminResponse: query.adminResponse || "",
      isClosed: query.status === "closed",
    });
    setIsFormVisible(true);
  };

  // Handle query deletion
  const handleDeleteQuery = async (queryId, e) => {
    e.stopPropagation(); // Prevent triggering the row click event
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this query?"
    );

    if (confirmDelete) {
      try {
        // Comment: API call to delete the query would go here
        await axios.delete(`${backendURL}/api/queries/delete/${queryId}`);

        // Mock deletion for demo purposes
        setQueries((prev) => prev.filter((q) => q._id !== queryId));
        if (selectedQuery && selectedQuery.id === queryId) {
          setSelectedQuery(null);
          setIsFormVisible(false);
        }
        toast.success("Query deleted successfully");
      } catch (error) {
        console.error("Failed to delete query:", error.message);
        toast.error("Failed to delete query");
      }
    }
  };

  // Submit admin response
  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const queryId = selectedQuery._id || selectedQuery.id;
      if (!queryId) throw new Error("Query ID not found");

      // Prepare new communication object
      const newCommunication = {
        sender: "admin",
        message: formData.adminResponse,
        sentAt: new Date().toISOString(),
      };

      // API call to update the query with new communication (as array)
      const response = await axios.patch(
        `${backendURL}/api/queries/${queryId}/response`,
        {
          communications: [newCommunication],
          status: formData.isClosed ? "closed" : "open",
        }
      );

      if (response.data && response.data.success) {
        // Update queries state with new data from backend if available
        const updated = response.data.data;
        const updatedQueries = queries.map((q) => {
          const qid = q._id || q.id;
          return qid === queryId ? { ...q, ...updated } : q;
        });
        setQueries(updatedQueries);
        setSelectedQuery(
          updatedQueries.find((q) => (q._id || q.id) === queryId)
        );

        // Clear admin response field for next reply
        setFormData((prev) => ({ ...prev, adminResponse: "" }));

        // Send notification to client
        await sendNotification(
          selectedQuery.clientId,
          `Admin has responded to your query about "${selectedQuery.queryType}"`
        );

        toast.success("Response submitted successfully");
      }
    } catch (error) {
      console.error("Failed to submit response:", error.message);
      toast.error("Failed to submit response");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time as "X days ago"
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
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

  // Removed JS-based truncateDescription for table display. Use CSS truncation instead.

  // Filter queries by client if a client is selected
  const filteredQueries = selectedClient
    ? queries.filter((q) => q.clientId === selectedClient.id)
    : queries;

  // Filter queries by search term
  const searchedQueries = searchTerm
    ? filteredQueries.filter(
        (q) =>
          q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.queryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredQueries;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Query Support System
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Clients Queries Section - Hidden when form is visible */}
        {!isFormVisible && (
          <div className="w-full">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Clients Queries
                </h2>
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search queries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* code checks if searchedQueries is an array before using .length or .map,
               so you won't get a "Cannot read properties of undefined" error while queries are loading.
                The UI will show "Loading queries..." until the data is ready. */}

              {!Array.isArray(searchedQueries) ? (
                <p className="text-gray-500">Loading queries...</p>
              ) : searchedQueries.length === 0 ? (
                <p className="text-gray-500">No queries found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <div className="max-h-[500px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {searchedQueries.map((query, index) => (
                          <tr
                            key={index}
                            onClick={() => handleSelectQuery(query)}
                            className={`hover:bg-gray-50 cursor-pointer ${
                              selectedQuery?.id === query.id ? "bg-blue-50" : ""
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {query.client}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {query.queryType}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px] xl:max-w-[500px] truncate whitespace-nowrap">
                              {query.description}
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={(e) => handleDeleteQuery(query._id, e)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Query Response Form - Centered when visible */}
        {isFormVisible && (
          <div className="w-full lg:w-2/3 mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {selectedQuery ? "Query Response" : "Select a Query"}
                </h2>
                <button
                  onClick={() => {
                    setIsFormVisible(false);
                    setSelectedQuery(null);
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {selectedQuery ? (
                <form onSubmit={handleSubmitResponse}>
                  {/* Client Info */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Client Information
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-semibold">Name:</span>{" "}
                      {selectedQuery.client}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Query Date:</span>{" "}
                      {new Date(selectedQuery.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Query Type (read-only) */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Query Type
                    </label>
                    <input
                      type="text"
                      value={formData.queryType}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  {/* Description (read-only) */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      readOnly
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  {/* Photos (read-only, with modal preview) */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Uploaded Photos
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.photos && formData.photos.length > 0 ? (
                        formData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo}
                              alt={`Query photo ${index + 1}`}
                              className="h-20 w-20 object-cover rounded border cursor-pointer"
                              onClick={() => setModalPhoto(photo)}
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No photos uploaded</p>
                      )}
                    </div>

                    
                    {/* Modal for large photo preview */}
                    {modalPhoto && (
                      <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
                        onClick={closeModal}
                      >
                        <div
                          className="relative bg-white rounded-lg shadow-lg p-4"
                          onClick={e => e.stopPropagation()}
                        >
                          <img
                            src={modalPhoto}
                            alt="Preview"
                            className="max-w-[90vw] max-h-[80vh] object-contain rounded"
                          />
                          <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 bg-gray-700 text-white rounded-full px-2 py-1 text-lg"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Unified Communications Thread */}
                  <div className="mb-6">
                    <label className="block font-medium mb-2 text-blue-600">
                      Communication Thread
                    </label>
                    <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
                      {Array.isArray(selectedQuery.communications) &&
                      selectedQuery.communications.length > 0 ? (
                        selectedQuery.communications.map((comm, idx) => (
                          <div
                            key={idx}
                            className={`mb-4 p-3 rounded-lg ${
                              comm.sender === "admin"
                                ? "bg-blue-50 border-l-4 border-blue-500"
                                : "bg-green-50 border-l-4 border-green-500"
                            } ${comm.sender === 'client' ? '' : 'ml-6'}`}
                          >
                           
                            <div className="flex justify-between items-center mb-1">
                              <span
                                className={`font-semibold ${
                                  comm.sender === "admin"
                                    ? "text-blue-700"
                                    : "text-green-700"
                                }`}
                              >
                                {comm.sender === "admin" ? "Admin" : "Client"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {comm.sentAt
                                  ? new Date(comm.sentAt).toLocaleString()
                                  : ""}
                              </span>
                            </div>
                              {/* client message */}
                            <div className="text-gray-800 whitespace-pre-wrap">
                              {comm.message}
                            </div>  
                          </div>                    
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No communications yet. Start the conversation!
                        </p>
                      )}


                    </div>
                  </div>

                  {/* Admin Response */}
                  <div className="mb-6">
                    <label className="block font-medium mb-2 text-blue-600">
                      Your Response To Client ?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="adminResponse"
                      value={formData.adminResponse}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your response to the client's query..."
                    />
                  </div>

                  {/* Close Query Option */}
                  <div className="mb-6 flex items-center">
                    <input
                      type="checkbox"
                      id="isClosed"
                      name="isClosed"
                      checked={formData.isClosed}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isClosed: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="isClosed"
                      className="ml-2 block text-gray-700 sm:text-sm"
                    >
                      Mark as Closed (query resolved)
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFormVisible(false);
                        setSelectedQuery(null);
                      }}
                      className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 text-sm sm:text-base"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Response"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Please select a query from the list to response</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notifications Section (for demo purposes) */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Notifications
        </h2>
        {notifications.length > 0 ? (
          <ul className="space-y-2">
            {notifications.map((notification, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-md">
                <p className="text-gray-600">
                  <span className="font-semibold">
                    Client ({notification.clientId}):
                  </span>{" "}
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTimeAgo(notification.timestamp)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No notifications sent yet</p>
        )}
      </div>
    </div>
  );
};

export default QuerySupport;



