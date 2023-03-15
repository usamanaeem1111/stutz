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
    <div className="flex flex-col justify-center items-center">
      {saved && (
        <label
          className="relative flex flex-col w-full h-[180px]  border-dashed border-2 border-[#FE316E] bg-[#FEF3F6]  justify-center items-center rounded-xl  text-[#100307] font-thin  text-7xl cursor-pointer p-1"
          htmlFor="image-upload"
        >
          <div className=" text-[#585858] flex items-center justify-center flex-col  rounded-xl ">
            <p>+</p>
            <p className="text-sm">העלה או גרור לכאן</p>
          </div>
        </label>
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
      <div className="grid grid-cols-3 gap-4 my-5">
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

              <div className="h-[120px] w-[105px] bg-white m-1 rounded-2xl border border-[#E2E2E2] flex items-center justify-center cursor-pointer active:translate-y-[1px] overflow-hidden p-1 ">
                <img
                  className="w-full h-full object-cover rounded-xl"
                  style={{ objectFit: "contain" }}
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
