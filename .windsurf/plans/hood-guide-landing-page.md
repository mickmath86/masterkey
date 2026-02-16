# Thousand Oaks Neighborhood Guide Landing Page

Duplicate the sell landing page structure and transform it into a lead magnet for downloadable neighborhood scorecards featuring video content and ratings for 10 Thousand Oaks neighborhoods.

## Overview

The landing page will promote MasterKey's neighborhood video guides for Thousand Oaks, where each neighborhood is rated across 9 categories (plus an overall score). Users submit their contact info (first name, last name, email OR phone) to download the guide, triggering a webhook to Go High Level CRM.

## Neighborhoods to Feature

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

## Implementation Plan

### 1. Component Structure Analysis
- ✅ Reviewed existing `/landing/sell` structure
- ✅ Identified LandingPageV4 component architecture
- ✅ Analyzed sections: Hero, Content, CTA, About, Testimonials, Why This Works, FAQ, Footer

### 2. Create New Landing Page Components
- Create `/components/landing-pages/hood-guide/` directory structure
- Duplicate and customize the following sections:
  - **Hero Section**: Update headline to focus on neighborhood guides, replace video with neighborhood preview
  - **Content Section**: Replace M.A.S.T.E.R. system with neighborhood rating methodology
  - **CTA Sections**: Replace "Call Now" CTAs with "Download Guide" form CTAs
  - **About Section**: Update to explain the neighborhood rating system
  - **Testimonials**: Keep or customize for neighborhood guide context
  - **FAQ**: Create new FAQs about the neighborhood guides and ratings
  - **Footer**: Reuse existing footer

### 3. Lead Capture Form
- Create a simple form component for the hood-guide
- Fields required:
  - First Name (required)
  - Last Name (required)
  - Email (required OR phone)
  - Phone (required OR email)
  - Neighborhood selection dropdown (optional - to know which they're interested in)
- Form validation to ensure at least email OR phone is provided
- Submit button triggers webhook

### 4. Webhook Integration
- Create new webhook URL in Go High Level for hood-guide leads
- Update `/lib/webhook-api.ts` to add `submitHoodGuideLead()` method
- Webhook payload structure:
  ```typescript
  {
    contact: {
      firstName: string,
      lastName: string,
      email?: string,
      phone?: string
    },
    metadata: {
      leadSource: 'Thousand Oaks Hood Guide',
      neighborhoodInterest?: string,
      submittedAt: string
    }
  }
  ```

### 5. Content Updates

#### Hero Section
- **Headline**: "Discover the Best Neighborhoods in Thousand Oaks" or "Your Complete Guide to Thousand Oaks Neighborhoods"
- **Subheadline**: "Watch our expert video reviews and get detailed ratings for 10 neighborhoods. Download your free scorecard today."
- **CTA**: "Download Free Guide" button that opens form modal

#### Content Section
- Replace M.A.S.T.E.R. system explanation with:
  - Overview of rating methodology
  - Explanation of 9 rating categories
  - How the videos were created
  - What users will learn from the guide

#### Neighborhood Showcase
- Add a section showcasing all 10 neighborhoods
- Grid layout with neighborhood names
- Teaser ratings or highlights
- Visual elements (could use placeholder images initially)

#### FAQ Section
- "What neighborhoods are covered?"
- "How are the ratings calculated?"
- "What's included in the guide?"
- "Is the guide really free?"
- "How current is the information?"
- "Can I request a neighborhood tour?"

### 6. Page Route Setup
- Update `/app/landing/hood-guide/page.tsx` to use new HoodGuideLanding component
- Ensure proper metadata for SEO

### 7. Analytics & Tracking
- Add event tracking for:
  - Page views
  - Form opens
  - Form submissions
  - Download button clicks
- Integrate with existing PostHog, GA, and Plausible tracking

### 8. Download Mechanism
- After successful form submission and webhook:
  - Show success message
  - Trigger automatic download of PDF guide (or link to download)
  - Redirect to thank you page or show inline confirmation

## Questions for Clarification

1. **Webhook URL**: Do you have the specific Go High Level webhook URL for hood-guide leads, or should I create a placeholder that you'll update?

2. **Actual Ratings Data**: Do you have the actual ratings for each neighborhood across the 9 categories, or should I use placeholder data for now?

3. **Video Integration**: How should the videos be displayed? Should they be:
   - Embedded on the landing page (YouTube/Vimeo)?
   - Included in the downloadable guide?
   - Both?

4. **Download File**: What format should the guide be?
   - PDF with all neighborhood scorecards?
   - Do you have this file ready, or should I create a placeholder download?

5. **Form Behavior**: Should the form be:
   - A modal/popup that appears when clicking CTA buttons?
   - An inline section on the page?
   - A separate form page?

6. **Neighborhood Selection**: Should users select which neighborhood they're most interested in during form submission, or is the guide for all neighborhoods?

7. **Design Preferences**: Should I maintain the same blue/sky color scheme from the sell page, or would you like different branding for the neighborhood guide?

## Next Steps

Once you answer the clarification questions, I'll proceed with:
1. Creating the component directory structure
2. Building the customized sections
3. Implementing the lead capture form
4. Setting up webhook integration
5. Testing the complete flow
