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
      <div className="h-[110px] w-[96px] bg-white m-1 rounded-2xl border border-[#E2E2E2] flex items-center justify-center cursor-pointer active:translate-y-[1px]">
        <label
          className="h-[100px] w-[85px] bg-[#F9F3F5] rounded-2xl flex items-center justify-center text-[#100307] text-3xl cursor-pointer"
          htmlFor="image-upload"
        >
          +
        </label>
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        id="image-upload"
        lang="he"
        aria-label="בחר קבצים"
        style={{ display: "none" }}
      />

      <div className="flex justify-start mt-5 bg-black/10 p-4 rounded-lg shadow-md">
        {images.map((imageUrl: any, index: number) => (
          <div key={imageUrl} className="relative inline-block">
            <button
              className="absolute bottom-[10px] right-[10px] bg-white text-[#100307] rounded-full w-7 h-7 flex items-center justify-center"
              onClick={() => handleRemoveImage(index)}
            >
              &times;
            </button>
            <div className="h-[110px] w-[96px] bg-white m-1 rounded-2xl border border-[#E2E2E2] flex items-center justify-center cursor-pointer active:translate-y-[1px]">
              <img
                className="w-full h-full m-1 rounded-lg"
                src={imageUrl}
                alt={imageUrl}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
