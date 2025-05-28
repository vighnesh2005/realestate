// cloudinary.js
import axios from "axios";

// Upload to Cloudinary
export const Upload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET); // Use your preset
  formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url;

  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};

const extractPublicId = (url) => {
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(p => p === 'upload');
  const idParts = parts.slice(uploadIndex + 1);
  if (idParts[0].startsWith('v') && /^\d+$/.test(idParts[0].slice(1))) {
    idParts.shift(); // remove version
  }
  const publicIdWithExtension = idParts.join('/');
  return publicIdWithExtension.replace(/\.[^/.]+$/, "");
};

// Call backend to delete
export const Delete = async (url) => {
  const public_id = extractPublicId(url);

  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delete-image`, {
      public_id,
    });

    return res.data;
  } catch (err) {
    console.error("Delete failed:", err);
    return null;
  }
};
