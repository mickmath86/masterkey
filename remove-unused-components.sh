#!/bin/bash

# Remove unused UI components that are causing deployment errors
echo "Removing unused UI components..."

# List of unused components to remove
UNUSED_COMPONENTS=(
    "accordion.tsx"
    "alert.tsx"
    "aspect-ratio.tsx"
    "avatar.tsx"
    "breadcrumb.tsx"
    "checkbox.tsx"
    "collapsible.tsx"
    "dialog.tsx"
    "drawer.tsx"
    "dropdown-menu.tsx"
    "eyebrow.tsx"
    "github-globe.tsx"
    "glowing-effect.tsx"
    "google-street-test.tsx"
    "hover-card.tsx"
    "input-otp.tsx"
    "menubar.tsx"
    "popover.tsx"
    "progress.tsx"
    "radio-group.tsx"
    "resizable.tsx"
    "scroll-area.tsx"
    "select.tsx"
    "slider.tsx"
    "sonner.tsx"
    "switch.tsx"
    "table.tsx"
    "tabs.tsx"
    "textarea.tsx"
)

# Remove each unused component
for component in "${UNUSED_COMPONENTS[@]}"; do
    if [ -f "src/components/ui/$component" ]; then
        rm "src/components/ui/$component"
        echo "Removed: $component"
    else
        echo "Not found: $component"
    fi
done

echo "Cleanup complete!"
echo ""
echo "Kept components that are actually being used:"
echo "- button.tsx (used extensively)"
echo "- card.tsx (used in multiple components)"
echo "- badge.tsx (used for property data)"
echo "- separator.tsx (used for visual separation)"
echo "- input.tsx (used for forms)"
echo "- navigation-menu.tsx (used in navbar)"
echo "- chart.tsx & chart-radial-stacked.tsx (used for data viz)"
echo "- stepper.tsx (used in real-estate-buy)"
echo "- form.tsx, label.tsx (form utilities)"
echo "- sheet.tsx, skeleton.tsx, tooltip.tsx (used in sidebar)"
echo "- toggle.tsx, toggle-group.tsx (toggle components)"
echo "- Custom components: google-*, property-*, market-insights, etc."
