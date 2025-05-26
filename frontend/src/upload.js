import axios from "axios";

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "your_upload_preset");
  formData.append("cloud_name", "your_cloud_name");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
      formData
    );

    return response.data.secure_url;

  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};

export default uploadToCloudinary;
