import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function PropertyProfileMobile() {
  const phone = useAnimationControls();
  const scrollContent = useAnimationControls();
  const cursor = useAnimationControls();

  useEffect(() => {
    const runAnimation = async () => {
      // Phase 1: Phone appears
      await phone.start({ y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22,1,0.36,1] } });
      
      // Phase 2: Content appears
      await scrollContent.start({ opacity: 1, transition: { duration: 0.6 } });
      
      // Phase 3: Cursor appears and starts scrolling
      await cursor.start({ opacity: 1, transition: { duration: 0.3 } });
      
      // Phase 4: Scroll animation - move content up to simulate scrolling down
      await scrollContent.start({ 
        y: -800, 
        transition: { duration: 4, ease: [0.25, 0.46, 0.45, 0.94] } 
      });
      
      // Phase 5: Reset and loop
      setTimeout(() => {
        phone.set({ y: 40, opacity: 0 });
        scrollContent.set({ y: 0, opacity: 0 });
        cursor.set({ opacity: 0 });
        runAnimation();
      }, 1500);
    };

    runAnimation();
  }, []);

  return (
    <div className="relative h-[640px] w-full bg-gray-50 text-gray-900 overflow-hidden">
      {/* device frame */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={phone}
        className="absolute left-1/2 top-16 -translate-x-1/2 w-[360px] h-[740px] rounded-[42px] border-2 border-gray-800 bg-gradient-to-b from-black to-gray-800 shadow-2xl"
      >
        <div className="absolute inset-3 rounded-[36px] bg-white overflow-hidden">
          {/* Scrollable content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={scrollContent}
            className="relative w-full"
            style={{ height: '1200px' }} // Make content taller than container to enable scrolling
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">Property Report</div>
                <div className="text-xs text-gray-500">MasterKey</div>
              </div>
            </div>

            {/* Property Image */}
            <div className="relative h-32 bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Property"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Property Header */}
            <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50">
              <div className="text-lg font-bold text-gray-900 mb-1">1234 Oak Avenue</div>
              <div className="text-sm text-gray-600 mb-3">Los Angeles, CA 90210</div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>3 bed</span>
                <span>2 bath</span>
                <span>1,850 sq ft</span>
              </div>
            </div>

            {/* Valuation Card */}
            <div className="p-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Estimated Value</div>
                  <div className="text-3xl font-bold text-green-600 mb-2">$875,000</div>
                  <div className="text-sm text-green-600 font-medium">+$48,000 (6%)</div>
                </div>
              </div>
            </div>

            {/* Improvements */}
            <div className="px-4 pb-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-900 mb-3">Improvements</div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-medium text-gray-900">Kitchen Remodel</div>
                      <div className="text-xs text-gray-600">Modern appliances & finishes</div>
                    </div>
                    <div className="text-xs font-semibold text-green-600">+$25,000</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-medium text-gray-900">Bathroom Updates</div>
                      <div className="text-xs text-gray-600">Tile & fixture upgrades</div>
                    </div>
                    <div className="text-xs font-semibold text-green-600">+$15,000</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs font-medium text-gray-900">Landscaping</div>
                      <div className="text-xs text-gray-600">Curb appeal enhancement</div>
                    </div>
                    <div className="text-xs font-semibold text-green-600">+$8,000</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="px-4 pb-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="text-sm font-semibold text-gray-900">AI Recommendation</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 mb-3">
                  <div className="text-sm font-medium text-green-800">Sell Now</div>
                  <div className="text-xs text-green-700">Market conditions are favorable</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Market trending upward (+12%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Low inventory in your area</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Spring selling season optimal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Statistics */}
            <div className="px-4 pb-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-900 mb-3">Market Statistics</div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">28</div>
                    <div className="text-xs text-gray-600">Avg Days on Market</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">47</div>
                    <div className="text-xs text-gray-600">New Listings (30d)</div>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Median Sale Price</span>
                    <span className="font-medium">$825,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Sq Ft</span>
                    <span className="font-medium">$485</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="px-4 pb-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-900 mb-3">Property Details</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-medium">1995</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lot Size</span>
                    <span className="font-medium">0.25 acres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium">Single Family</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Sale</span>
                    <span className="font-medium">$650,000 (2019)</span>
                  </div>
                </div>
              </div>
            </div>


            {/* Contact Agent */}
            <div className="px-4 pb-6">
              <div className="bg-sky-50 rounded-lg border border-sky-200 p-4">
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Ready to Get Started?</div>
                  <div className="text-xs text-gray-600 mb-3">Contact Mike Mathias for a detailed consultation</div>
                  <button className="w-full bg-sky-500 text-white py-2 rounded-lg text-xs font-medium">
                    Schedule Consultation
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* animated cursor - simulates finger scrolling */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 w-6 h-6 rounded-full bg-sky-500/30 border-2 border-sky-500"
        animate={cursor}
        initial={{ opacity: 0 }}
      />
    </div>
  );
}
