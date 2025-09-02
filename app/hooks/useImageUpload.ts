import { useCallback } from "react";
import { useImageGallery } from "../contexts/ImageGalleryContext";

export function useImageUpload() {
  const { addImage } = useImageGallery();

  const uploadImage = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      addImage(data.image);
    },
    [addImage]
  );

  return uploadImage;
}
