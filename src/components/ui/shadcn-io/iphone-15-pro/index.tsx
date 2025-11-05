import type { SVGProps } from "react";
import { useState, useEffect } from "react";

export interface Iphone15ProProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  src?: string;
  videoSrc?: string;
}

// Questionnaire steps data
const questionnaireSteps = [
  {
    step: 1,
    title: "What's the address of the property?",
    subtitle: "Enter the full address for accurate insights",
    type: "input",
    placeholder: "123 Main Street, San Francisco, CA",
    value: "1234 Oak Avenue, Los Angeles, CA 90210"
  },
  {
    step: 2,
    title: "What brings you here today?",
    subtitle: "Help us understand your situation",
    type: "options",
    options: [
      "I am looking to sell my property",
      "I am just curious about market conditions"
    ],
    selected: 0
  },
  {
    step: 3,
    title: "When are you looking to sell?",
    subtitle: "Understanding your timeline helps us create the right strategy",
    type: "options",
    options: [
      "ASAP (within 30 days)",
      "Within 3 months",
      "Within 6 months",
      "Within a year",
      "Just exploring my options"
    ],
    selected: 1
  },
  {
    step: 4,
    title: "What's motivating you to sell?",
    subtitle: "This helps us tailor our approach to your needs",
    type: "options",
    options: [
      "Relocating for work",
      "Upgrading to a larger home",
      "Downsizing",
      "Financial reasons",
      "Life changes (divorce, retirement, etc.)"
    ],
    selected: 1
  },
  {
    step: 5,
    title: "What's the condition of your home?",
    subtitle: "This helps us advise on improvements",
    type: "rating",
    options: [
      { text: "Excellent - Move-in ready", stars: 5 },
      { text: "Good - Minor updates needed", stars: 4 },
      { text: "Fair - Some renovations required", stars: 3 }
    ],
    selected: 1
  }
];

export default function Iphone15Pro({
  width = 433,
  height = 882,
  src,
  videoSrc,
  ...props
}: Iphone15ProProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % questionnaireSteps.length);
        setIsAnimating(false);
        
        // Show typing animation for input step
        if (questionnaireSteps[(currentStep + 1) % questionnaireSteps.length].type === 'input') {
          setTimeout(() => setShowTyping(true), 500);
          setTimeout(() => setShowTyping(false), 2000);
        }
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentStep]);

  const currentStepData = questionnaireSteps[currentStep];
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M1 234C1 233.448 1.44772 233 2 233H3.5V300H2C1.44772 300 1 299.552 1 299V234Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M1 319C1 318.448 1.44772 318 2 318H3.5V385H2C1.44772 385 1 384.552 1 384V319Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M430 279H432C432.552 279 433 279.448 433 280V384C433 384.552 432.552 385 432 385H430V279Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z"
        className="fill-white dark:fill-[#262626]"
      />
      <path
        opacity="0.5"
        d="M174 5H258V5.5C258 6.60457 257.105 7.5 256 7.5H176C174.895 7.5 174 6.60457 174 5.5V5Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M21.25 75C21.25 44.2101 46.2101 19.25 77 19.25H355C385.79 19.25 410.75 44.2101 410.75 75V807C410.75 837.79 385.79 862.75 355 862.75H77C46.2101 862.75 21.25 837.79 21.25 807V75Z"
        className="fill-[#E5E5E5] stroke-[#E5E5E5] stroke-[0.5] dark:fill-[#404040] dark:stroke-[#404040]"
      />

      {/* Questionnaire UI Animation */}
      {!src && !videoSrc && (
        <foreignObject
          x="21.25"
          y="19.25"
          width="389.5"
          height="843.5"
          clipPath="url(#roundedCorners)"
        >
          <div className={`w-full h-full bg-gray-50 flex flex-col transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="text-xs font-medium text-gray-900">MasterKey</div>
              <div className="text-xs text-gray-500">Step {currentStepData.step} of 5</div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-white px-4 py-2 border-b border-gray-100">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${(currentStepData.step / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 py-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                  {currentStepData.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentStepData.subtitle}
                </p>
              </div>

              {/* Input Field */}
              {currentStepData.type === 'input' && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={currentStepData.placeholder}
                      value={showTyping ? currentStepData.value : ''}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly
                    />
                    {showTyping && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-1 h-4 bg-blue-500 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Options */}
              {currentStepData.type === 'options' && (
                <div className="space-y-3">
                  {currentStepData.options?.slice(0, 3).map((option, index) => (
                    <button
                      key={index}
                      className={`w-full p-3 text-left border rounded-lg text-sm transition-all duration-200 ${
                        index === currentStepData.selected
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{typeof option === 'string' ? option : option.text}</span>
                        {index === currentStepData.selected && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                  {currentStepData.options && currentStepData.options.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{currentStepData.options.length - 3} more options
                    </div>
                  )}
                </div>
              )}

              {/* Rating Options */}
              {currentStepData.type === 'rating' && (
                <div className="space-y-3">
                  {currentStepData.options?.map((option: any, index: number) => (
                    <button
                      key={index}
                      className={`w-full p-3 text-left border rounded-lg text-sm transition-all duration-200 ${
                        index === currentStepData.selected
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-300 bg-white text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium text-xs">{option.text}</span>
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 mr-0.5 ${
                                  i < option.stars ? 'bg-yellow-400' : 'bg-gray-300'
                                } rounded-full`}
                              />
                            ))}
                          </div>
                        </div>
                        {index === currentStepData.selected && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div className="p-4 bg-white border-t border-gray-200">
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                {currentStepData.step === 5 ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        </foreignObject>
      )}

      {src && (
        <image
          href={src}
          x="21.25"
          y="19.25"
          width="389.5"
          height="843.5"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#roundedCorners)"
        />
      )}
      {videoSrc && (
        <foreignObject
          x="21.25"
          y="19.25"
          width="389.5"
          height="843.5"
          clipPath="url(#roundedCorners)"
        >
          <video
            className="size-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        </foreignObject>
      )}
      <path
        d="M154 48.5C154 38.2827 162.283 30 172.5 30H259.5C269.717 30 278 38.2827 278 48.5C278 58.7173 269.717 67 259.5 67H172.5C162.283 67 154 58.7173 154 48.5Z"
        className="fill-[#F5F5F5] dark:fill-[#262626]"
      />
      <path
        d="M249 48.5C249 42.701 253.701 38 259.5 38C265.299 38 270 42.701 270 48.5C270 54.299 265.299 59 259.5 59C253.701 59 249 54.299 249 48.5Z"
        className="fill-[#F5F5F5] dark:fill-[#262626]"
      />
      <path
        d="M254 48.5C254 45.4624 256.462 43 259.5 43C262.538 43 265 45.4624 265 48.5C265 51.5376 262.538 54 259.5 54C256.462 54 254 51.5376 254 48.5Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <defs>
        <clipPath id="roundedCorners">
          <rect
            x="21.25"
            y="19.25"
            width="389.5"
            height="843.5"
            rx="55.75"
            ry="55.75"
          />
        </clipPath>
      </defs>
    </svg>
  );
}