export function gtmPush(event: string, data: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...data,
  });
}

// Specific event for listing presentation completion
export function trackListingPresentationCompleted(data: {
  address?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  yearBuilt?: number;
  [key: string]: any;
}) {
  gtmPush("listing_presentation_completed", {
    event_category: "form_completion",
    event_label: "questionnaire_step_9",
    ...data,
  });
}
