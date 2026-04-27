import React from 'react'
import { CurrencyIllustration } from '@/components/ui/illustrations/currency-illustration2'
import { FlowIllustration } from '@/components/illustrations/flow'
import { TokenCounterIllustration } from '@/components/illustrations/token-counter'

function ComponentTest() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 p-8">
      <CurrencyIllustration />
      <FlowIllustration />
      <TokenCounterIllustration />
    </div>
  )
}

export default ComponentTest