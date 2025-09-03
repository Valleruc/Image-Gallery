'use client';

import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import { useImageSearch } from './hooks/useImageSearch';
import UploadButton from './components/UploadButton';
import { useImageUpload } from './hooks/useImageUpload';
import ImageGallery from './components/ImageGallery';
import { useImageGallery } from './contexts/ImageGalleryContext';
import { Image } from './types';
import ImagePreview from './components/ImagePreview';

export default function Home() {
  // User Search Input State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  // Get filtered images
  const { filteredImages, isSearching } = useImageSearch(searchQuery);

  const uploadImage = useImageUpload();
  const { removeImage, setImages } = useImageGallery();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images');
        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };

    fetchImages();
  }, [setImages]);

  // Handle image deletion
  const handleDeleteImage = (image: Image): boolean => {
    try {
      return removeImage(image.id);
    } catch (error) {
      console.error('Failed to delete image:', error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <UploadButton onUpload={uploadImage} />
          </div>
          <div className="text-black mb-4">
            {filteredImages.length} images
          </div>
          <ImageGallery
            images={filteredImages}
            onDeleteImage={handleDeleteImage}
            onImageClick={setSelectedImage}
            isLoading={isSearching}
          />
        </div>
      </div>
      
      {/* Image Preview Modal */}
      {selectedImage && (
        <ImagePreview
          image={selectedImage}
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={async (image) => {
            const success = handleDeleteImage(image);
            if (success) {
              setSelectedImage(null);
            }
            return success;
          }}
        />
      )}
    </div>
  );
}