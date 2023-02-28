import React, { useState } from "react";

interface Props {
  label?: string;
  name?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<Props> = ({ label, name, onChange }) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setPreview(e.target?.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }

    onChange(event);
  };

  return (
    <div>
      <label>
        {label}
        <input type="file" name={name} onChange={handleImageChange} />
      </label>
      {preview && <img src={preview as string} alt="Preview" />}
    </div>
  );
};

export default ImageUpload;
