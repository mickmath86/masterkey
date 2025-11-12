/**
 * Centralized redirect configuration for the MasterKey website
 * 
 * This file contains all page redirects in one place for easy management.
 * Add new redirects here and they will automatically be applied.
 * 
 * Redirect types:
 * - permanent: true (301 redirect) - for permanent moves, better for SEO
 * - permanent: false (302 redirect) - for temporary redirects
 */

const redirects = [
  // Redirect /valuation to the listing presentation landing page
  {
    source: '/valuation',
    destination: '/landing/listing-presentation',
    permanent: true, // 301 redirect - permanent move
  },
  
  // Add more redirects here as needed
  // Example:
  // {
  //   source: '/old-page',
  //   destination: '/new-page',
  //   permanent: true,
  // },
];

module.exports = redirects;
