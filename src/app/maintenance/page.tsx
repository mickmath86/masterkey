"use client";

import { Wrench, Clock, Mail } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="relative bg-white rounded-full p-6 shadow-xl">
              <Wrench className="w-16 h-16 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            We'll Be Back Soon
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            Our site is currently undergoing scheduled maintenance to bring you an even better experience.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-4 max-w-md mx-auto pt-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 mb-1">Expected Duration</p>
            <p className="text-xs text-gray-500">A few hours</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-900 mb-1">Need Help?</p>
            <p className="text-xs text-gray-500">Contact support</p>
          </div>
        </div>

        {/* Footer Message */}
        <div className="pt-8">
          <p className="text-sm text-gray-500">
            Thank you for your patience. We appreciate your understanding.
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center gap-2 pt-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
