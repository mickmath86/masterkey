import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "What exactly is the Verified Value Guarantee?",
    answer:
      "The Verified Value Guarantee means we commit to securing a written offer within 2% of your home's independently appraised value within the agreed timeframe. If we don't, we waive our commission. The guarantee is tied to a professional third-party appraisal, not estimates or opinions.",
  },
  {
    question: 'Who pays for the appraisal?',
    answer:
      "We do. As part of our process, MasterKey covers the cost of a professional third-party appraisal to establish your verified value. If the listing is cancelled early or the terms of the guarantee aren't met, the appraisal cost may be reimbursed.",
  },
  {
    question: 'Who chooses the appraiser?',
    answer:
      "You do. We provide a short list of vetted, independent appraisers, and you select the one you're most comfortable with. This ensures full independence and transparency in the valuation.",
  },
  {
    question: 'How is the guaranteed offer amount calculated?',
    answer:
      "Your guaranteed offer threshold is 98% of the appraised value. For example, if the appraisal comes in at $1,000,000, our guarantee applies to offers of $980,000 or higher.",
  },
  {
    question: "What counts as a qualifying offer?",
    answer:
      "A qualifying offer must be: In writing, from a qualified buyer, at or above 98% of the appraised value, and submitted within the agreed guarantee timeframe.",
  },
  {
    question: 'What happens if I receive an offer that meets the guarantee but choose not to accept it?',
    answer:
      "If a qualifying offer is received and declined, the guarantee is considered fulfilled and standard commission terms apply. The guarantee is designed to ensure performance — not to override seller choice.",
  },
  {
    question: "What if my home doesn't qualify for the guarantee?",
    answer:
      "Not every home is a fit. Factors like condition, location, pricing expectations, and market dynamics all matter. If your home doesn't qualify, we'll explain why and outline your best available options — with no obligation.",
  },
  {
    question: 'What if the appraisal comes in lower than expected?',
    answer:
      "Appraisals are independent and reflect current market conditions. If the appraisal comes in significantly below comparable market data, we'll review the findings with you and determine whether it makes sense to proceed under the guarantee or adjust the strategy.",
  },
  {
    question: "Does this mean you're guaranteeing my home will sell?",
    answer:
      "No. We guarantee our performance — specifically, securing a qualifying offer within the defined range. The final decision to accept any offer always remains with you.",
  },
  {
    question: 'How long does the guarantee last?',
    answer:
      "The guarantee period begins once your home goes live on the market and lasts for the timeframe outlined in your listing agreement, typically up to 60 days.",
  },
  {
    question: 'What if I cancel the listing early?',
    answer:
      "If the listing is terminated before the guarantee period ends, the guarantee no longer applies and certain costs (such as the appraisal) may be reimbursed.",
  },
  {
    question: 'Are there requirements I need to meet as the seller?',
    answer:
      "Yes. To ensure the best possible outcome, sellers must: Follow the agreed pricing strategy, allow reasonable showing access, maintain the home's condition, complete agreed-upon prep or repairs, and respond to offers in good faith. These conditions are clearly outlined upfront.",
  },
  {
    question: 'What if the inspection uncovers major issues?',
    answer:
      "If material issues are discovered that significantly impact value or marketability, we'll reassess the pricing strategy and guarantee terms together. Transparency protects both sides.",
  },
  {
    question: 'How is this different from a traditional listing?',
    answer:
      "Most traditional listings rely on estimates, opinions, and hope. Our approach verifies value upfront, launches with a defined plan, and puts our commission at risk if we don't perform. It's a more structured, accountable way to sell.",
  },
  {
    question: 'Is there any obligation to move forward after the consultation?',
    answer:
      "No. The initial consultation is simply to determine whether your home qualifies and whether this approach makes sense for you. There's no pressure and no obligation.",
  },
  {
    question: "What's the first step if I want to learn more?",
    answer:
      "The first step is a quick call or text to see if your home qualifies. We'll walk you through the process, answer your questions, and outline next steps clearly.",
  },
]

export default function FAQ() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Frequently asked questions
          </h2>
          <dl className="mt-16 divide-y divide-gray-900/10 dark:divide-white/10">
            {faqs.map((faq) => (
              <Disclosure key={faq.question} as="div" className="py-6 first:pt-0 last:pb-0">
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900 dark:text-white">
                    <span className="text-base/7 font-semibold">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <PlusSmallIcon aria-hidden="true" className="size-6 group-data-open:hidden" />
                      <MinusSmallIcon aria-hidden="true" className="size-6 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <p className="text-base/7 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
