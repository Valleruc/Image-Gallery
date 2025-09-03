export interface Image {
  id: string;
  filename: string;
  path: string;
  size: number;
  uploadedAt: Date;
}

export interface ImageGalleryContextType {
  imageGallery: Image[];
  hasImage: (id: string) => boolean;
  addImage: (newImage: Image) => boolean;
  removeImage: (id: string) => boolean;
  setImages: (images: Image[]) => boolean;
  updateImage: (image: Image) => boolean;
  searchImages: (name: string) => Image[];
}

//TODO: make this be more dynamic via API
export const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
