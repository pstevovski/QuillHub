"use client";

import fetchHandler from "@/utils/fetchHandler";
import { useEffect, useState } from "react";

/**
 *
 * Shows a confirmation modal to the user on page exit if the form values have been updated.
 * This includes only the following scenarios:
 *  - User closes the tab or the browser
 *  - User redirects to another page using a regular link
 *
 * When navigating away from the page, remove images that were uploaded to Uploadthing servers.
 *
 */
export default function useDeleteUploadedImages(
  isDirty: boolean = false,
  coverImageKeys: string[],
  contentImageKeys: string[]
) {
  const [imageKeys, setImageKeys] = useState<string[]>([]);

  // Merge the "cover" and "content" image keys into a single array
  // and filter out any potential duplicates, using only unique values
  useEffect(() => {
    const mergedUniqueKeys: string[] = [
      ...new Set(coverImageKeys),
      ...new Set(contentImageKeys),
    ].flat();

    setImageKeys(mergedUniqueKeys);
  }, [coverImageKeys, contentImageKeys]);

  // Show a confirmation modal to the user leaving the page if the form values have been updated
  // Note: There's no way to trigger the API call to remove the uploaded images in this scenario
  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) return;
      event.preventDefault();

      // prettier-ignore
      event.returnValue = "You have unsaved changes. Are you sure you want to leave the page?"
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Remove the images from Uploadthing servers when navigating away from the page
  useEffect(() => {
    return () => handleDeleteImagesRequest();
  }, [imageKeys]);

  // Send API request to the Uploadthing servers to remove the images
  const handleDeleteImagesRequest = () => {
    if (!imageKeys.length) return;
    fetchHandler("DELETE", "uploadthing/delete", { keys: imageKeys });
  };
}
