import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/userStore";
const UploadEmployerIdPage = () => {
  const { uploadEmployerId } = userStore();
  const [selectedEmployerID, setSelectedEmployerID] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("/upload.png");
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setSelectedEmployerID(reader.result);
      setPreviewUrl(reader.result);
    };
  };

  const handleEmployerIDChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedEmployerID) {
      return;
    }

    setIsUploading(true);
    try {
      await uploadEmployerId({ verificationId: selectedEmployerID });
      setSelectedEmployerID(null);
      setPreviewUrl("/upload.png");

      let timeLeft = 10;
      setCountdown(timeLeft);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            navigate("/employer-profile");
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Failed to upload employer ID:", error);
    }
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2 font-poppins ">
          Upload Employer ID Verification
        </h2>
        <p className="text-gray-600 text-center mb-4 font-poppins">
          Drag & drop your Employer ID here, or click the upload button. Only
          JPEG and PNG formats are accepted.
        </p>

        <div
          className="relative h-60 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden flex items-center justify-center text-gray-500 text-sm cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Employer ID Preview"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          ) : (
            <p>Drag & drop or click the button below to upload</p>
          )}

          <label
            htmlFor="file-upload"
            className="absolute bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full cursor-pointer shadow-md hover:bg-gray-700 transition duration-300"
          >
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleEmployerIDChange}
            />
            📷
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={isUploading || !selectedEmployerID}
          className={`mt-4 w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${
            isUploading || !selectedEmployerID
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload Employer ID"}
        </button>

        {countdown !== null && (
          <h1 className="mt-4 text-center text-lg font-semibold text-blue-600 font-poppins">
            Please wait {countdown} seconds. Your profile verification may take
            up to 24 hours.
          </h1>
        )}

        {isModalOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
            onClick={() => setIsModalOpen(false)}
          >
            <div className="max-w-3xl p-4 bg-white rounded-lg shadow-lg">
              <img
                src={previewUrl}
                alt="Zoomed Employer ID"
                className="w-full h-auto"
              />
              <button
                className="mt-2 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadEmployerIdPage;
