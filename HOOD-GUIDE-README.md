# Thousand Oaks Neighborhood Guide Landing Page

## Overview
A lead magnet landing page for downloadable neighborhood scorecards featuring video content and ratings for 10 Thousand Oaks neighborhoods.

## Page Structure

### 1. Hero Section (Form + Image)
- **Layout**: 2-column (form left, image right)
- **Form Fields**:
  - First Name (required)
  - Last Name (required)
  - Email (required OR phone)
  - Phone (optional if email provided)
  - Neighborhood Interest dropdown (optional)
- **Validation**: Requires at least email OR phone number
- **CTA**: "Download Free Guide" button
- **Right Side**: Placeholder for map/illustration image with rating categories preview

### 2. VSL Video Section
- Placeholder for video player (Wistia/YouTube/Vimeo)
- Bordered section matching sell page design
- Ready for video embed

### 3. Value Proposition Section
- **9 Rating Categories** displayed with icons:
  - Amenities
  - Transit & Commute
  - Schools
  - Economic Stability
  - Health & Safety Access
  - Crime
  - Area Value
  - Space & Density
  - Overall Score
- **"What's Included"** section highlighting guide benefits

### 4. About Us Section
- Copied from sell page
- Team information
- Company stats
- Maintains existing branding

### 5. Testimonials Section
- Copied from sell page
- Customer reviews
- Social proof

### 6. Final CTA Section
- "Get Your Free Guide" button (scrolls to top)
- Phone number link
- Placeholder image

### 7. Footer
- Standard footer from sell page

## Neighborhoods Covered
1. Wildwood
2. Lynn Ranch
3. Shadow Oaks/Eichler Homes
4. North Central Thousand Oaks
5. Sunset Hills/Copperwood
6. Hillcrest
7. Thousand Oaks South
8. North East Thousand Oaks
9. Central Thousand Oaks
10. Conejo Oaks

## Rating Categories (out of 10)
1. Amenities
2. Transit & Commute
3. Schools
4. Economic Stability
5. Health & Safety Access
6. Crime
7. Area Value
8. Space & Density
9. Overall Score (averaged)

## Webhook Integration

### Placeholder Webhook URL
Located in: `/src/components/landing-pages/hood-guide/sections/hero-section.tsx`

```typescript
const webhookUrl = 'PLACEHOLDER_WEBHOOK_URL'
```

**TODO**: Replace with actual Go High Level webhook URL

### Webhook Payload Structure
```json
{
  "contact": {
    "firstName": "string",
    "lastName": "string",
    "email": "string | null",
    "phone": "string | null"
  },
  "metadata": {
    "leadSource": "Thousand Oaks Hood Guide",
    "neighborhoodInterest": "string",
    "submittedAt": "ISO timestamp"
  }
}
```

## PDF Download

### Placeholder PDF Path
Located in: `/src/components/landing-pages/hood-guide/sections/hero-section.tsx`

```typescript
const pdfUrl = '/downloads/thousand-oaks-neighborhood-guide.pdf'
```

**TODO**: 
1. Create/upload the actual PDF guide
2. Place it in `/public/downloads/` directory
3. Update the path if needed

## Files Created

### Main Page
- `/src/app/landing/hood-guide/page.tsx`

### Components
- `/src/components/landing-pages/hood-guide/page.tsx` (main component)
- `/src/components/landing-pages/hood-guide/sections/hero-section.tsx`
- `/src/components/landing-pages/hood-guide/sections/video-section.tsx`
- `/src/components/landing-pages/hood-guide/sections/value-section.tsx`
- `/src/components/landing-pages/hood-guide/sections/cta-section.tsx`
- `/src/components/landing-pages/hood-guide/sections/about-us.tsx`
- `/src/components/landing-pages/hood-guide/sections/header.tsx`
- `/src/components/landing-pages/hood-guide/sections/footer.tsx`
- `/src/components/landing-pages/hood-guide/components/testimonials.tsx`
- `/src/components/landing-pages/hood-guide/components/our-team.tsx`

## Next Steps

### 1. Replace Placeholder Webhook URL
Update the webhook URL in `hero-section.tsx` with your actual Go High Level webhook URL.

### 2. Add Video
Replace the placeholder video section with your actual VSL video:
- Update video ID in `video-section.tsx`
- Or replace with YouTube/Vimeo embed

### 3. Add PDF Guide
- Create the PDF with all 10 neighborhood scorecards
- Upload to `/public/downloads/thousand-oaks-neighborhood-guide.pdf`

### 4. Add Map/Illustration Images
Replace the placeholder SVG in the hero section with your actual Illustrator images:
- Update the image source in `hero-section.tsx`
- Recommended: Place images in `/public/images/hood-guide/`

### 5. Test Form Submission
- Test the form validation
- Verify webhook fires correctly
- Confirm PDF download works

### 6. Optional Customizations
- Update testimonials if needed
- Adjust color scheme (currently uses sky-blue from sell page)
- Add analytics tracking
- Customize About Us section content

## Access the Page
Navigate to: `/landing/hood-guide`

## Design Notes
- Maintains the same blue/sky color scheme from the sell page
- Fully responsive (mobile, tablet, desktop)
- Dark mode compatible
- Form validation with error messages
- Success state after submission
