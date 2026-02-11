import axios from "axios";
import api from "./api";

const CLOUDINARY_URL =
  "https://api.cloudinary.com/v1_1/dpkpqgxqd/image/upload";

const UPLOAD_PRESET = "veraseijas";

const API_KEY = 'NKoaTozWvGAkeBxw04aFnAB4319yinH4';
const LIMIT = 25;

export const getImageList = async () => {
  const { data } = await api.get(`cloudinary/images`);
  return data;
}

export const deleteImage = async (publicId) => {
  const { data } = await api.delete(`cloudinary/delete/${publicId}`);
  return data;
}

export const uploadImageCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const { data } = await axios.post(CLOUDINARY_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return {
    name: data.original_filename,
    url: data.secure_url,
    format: data.format,
    height: data.height,
    width: data.width,
  };
};

export const getGiphy = async (search) => {
  try {
    const url = `https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(
      search
    )}&api_key=${API_KEY}&limit=${LIMIT}`;

    const resp = await fetch(url);
    const data = await resp.json();

    return data.data;
  } catch (error) {
    console.error('Error al obtener los GIFs de Giphy', error);
    return [];
  }
}