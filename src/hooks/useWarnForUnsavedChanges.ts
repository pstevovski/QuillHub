"use client";
import { useEffect } from "react";

/**
 *
 * Shows a confirmation modal to the user on page exit if the form values have been updated.
 * This includes only the following scenarios:
 *  - User closes the tab or the browser
 *  - User redirects to another page using a regular link
 *
 */
export default function useWarnForUnsavedChanges(isDirty: boolean = false) {
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
}
