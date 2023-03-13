import React, { useState } from "react";

interface Props {
  setFormData: (formData: any) => void;
  images: any;
  saved: any;
  isEditable: boolean;
}

const MAX_IMAGE_SIZE = 1024 * 1024 * 10; // 1MB in bytes

const ImageUploader: React.FC<Props> = ({
  setFormData,
  images,
  saved,
  isEditable,
}) => {
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
      {saved && (
        <div className=" bg-white m-1 rounded-2xl border border-[#E2E2E2] flex items-center justify-center cursor-pointer active:translate-y-[1px]">
          <label
            className=" rounded-2xl flex items-center justify-center text-[#100307] text-3xl cursor-pointer"
            htmlFor="image-upload"
          >
            +
          </label>
        </div>
      )}
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

      {!isEditable && images && images.length > 0 && (
        <div className="bg-white rounded-md shadow-md overflow-hidden max-w-[1080px] max-h-[1350px] mx-auto my-5">
          <img
            className="h-full w-full object-contain"
            src={images[0]}
            alt={images[0]}
          />
        </div>
      )}
      <div className="flex justify-start mt-5 p-4 rounded-lg">
        {images &&
          images.map((imageUrl: any, index: number) => (
            <div key={imageUrl} className="relative inline-block">
              {isEditable && (
                <button
                  className="absolute bottom-[10px] right-[10px] bg-white text-[#100307] rounded-full w-7 h-7 flex items-center justify-center hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
                  onClick={() => handleRemoveImage(index)}
                >
                  &times;
                </button>
              )}

              <div className="h-[80px] w-[80px] bg-white m-1 rounded-2xl border border-[#E2E2E2] flex items-center justify-center cursor-pointer active:translate-y-[1px]">
                <img
                  className="w-full h-full object-contain"
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
