"use client";

/**
 * GHL Chat Widget
 *
 * Renders the GoHighLevel chat widget script on any page.
 * To enable the widget on a page, import this component and add <GHLChatWidget />.
 *
 * Pages currently using this widget:
 *   - /landing/call
 *
 * To add a new page:
 *   1. Import this component at the top of the page file:
 *        import GHLChatWidget from "@/components/GHLChatWidget";
 *   2. Add <GHLChatWidget /> anywhere inside the page's JSX (bottom recommended).
 */

import { useEffect } from "react";

const WIDGET_ID = "69ea7d3fb3951be02826e41c";
const LOADER_URL = "https://widgets.leadconnectorhq.com/loader.js";
const RESOURCES_URL = "https://widgets.leadconnectorhq.com/chat-widget/loader.js";

export default function GHLChatWidget() {
  useEffect(() => {
    // Avoid double-injecting if script already exists
    if (document.querySelector(`script[data-widget-id="${WIDGET_ID}"]`)) return;

    const script = document.createElement("script");
    script.src = LOADER_URL;
    script.setAttribute("data-resources-url", RESOURCES_URL);
    script.setAttribute("data-widget-id", WIDGET_ID);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up on unmount so it doesn't persist when navigating away
      const existing = document.querySelector(`script[data-widget-id="${WIDGET_ID}"]`);
      if (existing) existing.remove();
    };
  }, []);

  return null;
}
