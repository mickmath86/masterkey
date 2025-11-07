import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

export default function ProductHero() {
  const phone = useAnimationControls();
  const screen1 = useAnimationControls();
  const screen2 = useAnimationControls();
  const screen3 = useAnimationControls();
  const screen4 = useAnimationControls();
  const cursor = useAnimationControls();
  
  const [currentScreen, setCurrentScreen] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [typedText, setTypedText] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<number | null>(null);

  useEffect(() => {
    const runAnimation = async () => {
      // Phase 1: Phone appears
      await phone.start({ y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22,1,0.36,1] } });
      
      // Phase 2: First screen content appears
      await screen1.start({ y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } });
      
      // Phase 3: Cursor moves to first answer and clicks
      await cursor.start({ 
        x: 180, y: 280, opacity: 1,
        transition: { duration: 1, ease: "easeInOut" } 
      });
      await cursor.start({ 
        scale: [1, 0.8, 1],
        transition: { duration: 0.3 } 
      });
      
      // Phase 4: Screen swipes left, show condition question
      await screen1.start({ x: -400, transition: { duration: 0.5, ease: "easeInOut" } });
      setCurrentScreen(2);
      setSelectedCondition(null);
      await screen2.start({ x: 0, y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } });
      
      // Phase 5: Cursor moves to condition answer and clicks
      await cursor.start({ 
        x: 180, y: 300,
        transition: { duration: 1, ease: "easeInOut" } 
      });
      setSelectedCondition(2); // Select "Good" condition
      await cursor.start({ 
        scale: [1, 0.8, 1],
        transition: { duration: 0.3 } 
      });
      
      // Phase 6: Screen swipes left, show upgrades question
      await screen2.start({ x: -400, transition: { duration: 0.5, ease: "easeInOut" } });
      setCurrentScreen(3);
      setTypedText('');
      await screen3.start({ x: 0, y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } });
      
      // Phase 7: Move cursor to text input area and simulate typing
      await cursor.start({ 
        x: 180, y: 350,
        transition: { duration: 0.8, ease: "easeInOut" } 
      });
      
      const text1 = "Kitchen Remodel";
      for (let i = 0; i <= text1.length; i++) {
        setTypedText(text1.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const text2 = text1 + ", Room Addition";
      for (let i = text1.length + 1; i <= text2.length; i++) {
        setTypedText(text2.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Phase 8: Hide upgrades screen and show loading screen
      await screen3.start({ opacity: 0, transition: { duration: 0.3 } });
      // Hide cursor during loading
      await cursor.start({ opacity: 0, transition: { duration: 0.2 } });
      setCurrentScreen(4);
      setCompletedSteps([]); // Reset completed steps
      await screen4.start({ y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } });
      
      // Phase 9: Complete steps in sequence
      setTimeout(() => setCompletedSteps([1]), 1000); // Complete step 1 after 1s
      setTimeout(() => setCompletedSteps([1, 2]), 1500); // Complete step 2 after 1.5s
      setTimeout(() => setCompletedSteps([1, 2, 3]), 2000); // Complete step 3 after 2s
      
      // Phase 10: Wait longer to show completed loading screen, then reset and loop
      setTimeout(() => {
        phone.set({ x: 0, y: 40, opacity: 0 });
        screen1.set({ x: 0, y: 24, opacity: 0 });
        screen2.set({ x: 400, y: 24, opacity: 0 });
        screen3.set({ x: 400, y: 24, opacity: 0 });
        screen4.set({ y: 24, opacity: 0 });
        cursor.set({ x: 40, y: 60, opacity: 0, scale: 1 });
        setCurrentScreen(1);
        setCompletedSteps([]);
        setTypedText('');
        setSelectedCondition(null);
        runAnimation();
      }, 4000);
    };

    runAnimation();
  }, []);

  return (
    <div className="relative rounded-lg p-2 h-[640px] w-full bg-none lg:bg-gray-50 text-gray-900 overflow-hidden">
      {/* device frame */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={phone}
        className="absolute left-1/2 top-16 -translate-x-1/2 w-[300px] h-[615px] lg:w-[360px] lg:h-[740px] rounded-[42px] border-2 border-gray-800 bg-gradient-to-b from-black to-gray-800 shadow-2xl"
      >
        <div className="absolute inset-3 rounded-[36px] bg-white overflow-hidden">
          {/* Screen 1 - First Question */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={screen1}
            className="absolute inset-0"
          >
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="h-6 w-20 rounded bg-sky-500 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">MasterKey</span>
                </div>
                <div className="text-xs text-gray-500">Step 2 of 9</div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-sky-500 h-1 rounded-full w-1/4"></div>
              </div>
              
              {/* Question */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  What brings you here today?
                </h3>
                <p className="text-xs text-gray-600">
                  Help us understand your situation
                </p>
              </div>
            </div>
            
            <div className="mx-4 mt-2 space-y-3">
              {/* Option buttons */}
              <button className="w-full p-3 text-left border-2 border-sky-500 bg-sky-50 rounded-lg text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sky-900">I am looking to sell my property</span>
                  <div className="w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left border border-gray-300 bg-white rounded-lg text-xs">
                <span className="text-gray-700">I am just curious about market conditions</span>
              </button>
              
              {/* Next button */}
              <button className="w-full bg-sky-500 text-white py-3 rounded-lg text-xs font-medium mt-6">
                Next
              </button>
            </div>
          </motion.div>

          {/* Screen 2 - Condition Question */}
          <motion.div
            initial={{ x: 400, y: 24, opacity: 0 }}
            animate={screen2}
            className="absolute inset-0"
          >
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="h-6 w-20 rounded bg-sky-500 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">MasterKey</span>
                </div>
                <div className="text-xs text-gray-500">Step 3 of 9</div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-sky-500 h-1 rounded-full w-1/3"></div>
              </div>
              
              {/* Question */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  What's the condition of your home?
                </h3>
                <p className="text-xs text-gray-600">
                  This helps us provide accurate valuation estimates
                </p>
              </div>
            </div>
            
            <div className="mx-4 mt-2 space-y-3">
              {/* Option buttons */}
              <button className={`w-full p-3 text-left rounded-lg text-xs ${selectedCondition === 1 ? 'border-2 border-sky-500 bg-sky-50' : 'border border-gray-300 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className={selectedCondition === 1 ? 'font-medium text-sky-900' : 'text-gray-700'}>Excellent - Move-in ready</span>
                  {selectedCondition === 1 && (
                    <div className="w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
              
              <button className={`w-full p-3 text-left rounded-lg text-xs ${selectedCondition === 2 ? 'border-2 border-sky-500 bg-sky-50' : 'border border-gray-300 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className={selectedCondition === 2 ? 'font-medium text-sky-900' : 'text-gray-700'}>Good - Minor updates needed</span>
                  {selectedCondition === 2 && (
                    <div className="w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
              
              <button className={`w-full p-3 text-left rounded-lg text-xs ${selectedCondition === 3 ? 'border-2 border-sky-500 bg-sky-50' : 'border border-gray-300 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <span className={selectedCondition === 3 ? 'font-medium text-sky-900' : 'text-gray-700'}>Fair - Some renovations required</span>
                  {selectedCondition === 3 && (
                    <div className="w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </motion.div>

          {/* Screen 3 - Upgrades Question */}
          <motion.div
            initial={{ x: 400, y: 24, opacity: 0 }}
            animate={screen3}
            className="absolute inset-0"
          >
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="h-6 w-20 rounded bg-sky-500 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">MasterKey</span>
                </div>
                <div className="text-xs text-gray-500">Step 4 of 9</div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-sky-500 h-1 rounded-full w-1/2"></div>
              </div>
              
              {/* Question */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Have you done any upgrades to your home?
                </h3>
                <p className="text-xs text-gray-600">
                  List any recent improvements or renovations
                </p>
              </div>
            </div>
            
            <div className="mx-4 mt-2">
              {/* Text input with typing animation */}
              <div className="w-full p-3 border border-gray-300 bg-white rounded-lg text-xs min-h-[80px]">
                <div className="text-gray-900">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Screen 4 - Loading Screen */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={screen4}
            className="absolute inset-0"
          >
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="h-6 w-20 rounded bg-sky-500 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">MasterKey</span>
                </div>
                <div className="text-xs text-gray-500">Processing...</div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-sky-500 h-1 rounded-full w-3/4 animate-pulse"></div>
              </div>
              
              {/* Title */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Analyzing Your Property
                </h3>
                <p className="text-xs text-gray-600">
                  Please wait while we process your information
                </p>
              </div>
            </div>
            
            <div className="mx-4 mt-6 space-y-3">
              {/* Loading Card 1 */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">Analyzing Property Data</div>
                    <div className="text-xs text-gray-500">Gathering market insights...</div>
                  </div>
                  {completedSteps.includes(1) ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>

              {/* Loading Card 2 */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">Generating AI Recommendations</div>
                    <div className="text-xs text-gray-500">Processing market trends...</div>
                  </div>
                  {completedSteps.includes(2) ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>

              {/* Loading Card 3 */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-900">Compiling Report</div>
                    <div className="text-xs text-gray-500">Finalizing your analysis...</div>
                  </div>
                  {completedSteps.includes(3) ? (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* animated cursor */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 h-5 w-5 rounded-full border-2 border-sky-500 bg-sky-500/20"
        animate={cursor}
      />
    </div>
  );
}
