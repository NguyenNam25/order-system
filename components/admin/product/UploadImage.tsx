"use client";

import { useState } from "react";

export default function UploadImage() {
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      "/api/uploads/products",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      return;
    }

    console.log(data);

    setImageUrl(data.imageUrl);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Product"
          className="h-40 w-40 object-contain"
        />
      )}
    </div>
  );
}