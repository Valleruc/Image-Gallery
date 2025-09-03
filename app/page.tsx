'use client';

import { useState, useEffect, useCallback } from 'react';
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

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Get filtered images
  const { filteredImages, isSearching } = useImageSearch(searchQuery);

  //Upload Images
  const uploadImage = useImageUpload();
  const { removeImage, setImages } = useImageGallery();

  // Initial API Fetch
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

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only show overlay if dragging files
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if drag leaves window
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    // Filter for image files
    const imageFiles = files.filter(file =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      alert('Please drop only image files');
      return;
    }

    // Upload each image
    for (const file of imageFiles) {
      try {
        await uploadImage(file);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        alert(`Failed to upload ${file.name}`);
      }
    }
  }, [uploadImage]);

  return (
    <div
      className="min-h-screen bg-gray-50 p-8 relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              {/* Search Bar */}
              <SearchBar onSearch={setSearchQuery} />
            </div>
            {/* Upload Button */}
            <UploadButton onUpload={uploadImage} />
          </div>
          <div className="text-black mb-4">
            {filteredImages.length} images
          </div>
          {/* Image Gallery */}
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

      {/* Drag and Drop Overlay */}
      {isDragging && (
        <div
          className="fixed inset-0 bg-black flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-white rounded-lg p-12">
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-black mb-2">
                Drop images here
              </h3>
              <p className="text-gray-600">
                Release to upload your images
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}