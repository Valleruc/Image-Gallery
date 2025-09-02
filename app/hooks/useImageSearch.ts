import { useMemo } from "react";
import { useImageGallery } from "../contexts/ImageGalleryContext";
import { useDebounce } from "./useDebounce";

export function useImageSearch(
  searchQuery: string,
  debounceDelay: number = 300
) {
  const { imageGallery, searchImages } = useImageGallery();

  // Debounce the search query
  const debouncedSearchQuery = useDebounce(searchQuery, debounceDelay);

  // Memoize the filtered results
  const filteredImages = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return imageGallery;
    }

    return searchImages(debouncedSearchQuery);
  }, [imageGallery, debouncedSearchQuery, searchImages]);

  return {
    filteredImages,
    isSearching: searchQuery !== debouncedSearchQuery,
    searchQuery: debouncedSearchQuery,
  };
}
