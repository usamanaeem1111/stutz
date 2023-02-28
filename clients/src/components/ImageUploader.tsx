import React, { useState } from "react";

interface Props {
  setFormData: (formData: any) => void;
  images: any;
}

const MAX_IMAGE_SIZE = 1024 * 1024 * 10; // 1MB in bytes

const ImageUploader: React.FC<Props> = ({ setFormData, images }) => {
  const [newImages, setNewImages] = useState<File[]>([]);

  const handleRemoveImage = (index: number) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      images: prevFormData.images.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedImages = Array.from(files)
        .filter((file) => file.size <= MAX_IMAGE_SIZE)
        .slice(0, 4);
      setNewImages(selectedImages);
      const promises = selectedImages.map((image) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(image);
        });
      });
      Promise.all(promises).then((urls) => {
        setFormData((prevFormData: any) => ({
          ...prevFormData,
          images: [...prevFormData.images, ...urls],
        }));
      });
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleChange} />

      <div className="flex justify-start mt-5 bg-black/10 p-4 rounded-lg shadow-md">
        {images.map((imageUrl: any, index: number) => (
          <div key={imageUrl} className="relative inline-block">
            <button
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              onClick={() => handleRemoveImage(index)}
            >
              &times;
            </button>
            <img
              className="w-[100px] h-[100px] m-1 rounded-lg"
              src={imageUrl}
              alt={imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
