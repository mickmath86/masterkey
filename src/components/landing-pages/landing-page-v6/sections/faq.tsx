import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "What exactly is your target price commitment?",
    answer:
      "Our target price commitment means we aim to secure a written offer within 2% of your home's target price point within the agreed timeframe. If we don't, we waive our commission. The target price is based on comprehensive market analysis and professional evaluation, not estimates or opinions.",
  },
  {
    question: 'Who pays for the market analysis and evaluation?',
    answer:
      "We do. As part of our process, MasterKey covers the cost of comprehensive market analysis and professional evaluation to establish your target price point. This is included in our service at no additional cost to you.",
  },
  {
    question: 'How is the target price determined?',
    answer:
      "Your target price is determined through comprehensive market analysis including recent comparable sales, current market conditions, buyer demand trends, and professional evaluation of your property's unique features and condition.",
  },
  {
    question: 'How is the target offer amount calculated?',
    answer:
      "Your target offer threshold is 98% of the established target price. For example, if the target price is $1,000,000, our commitment applies to offers of $980,000 or higher.",
  },
  {
    question: "What counts as a qualifying offer?",
    answer:
      "A qualifying offer must be: In writing, from a qualified buyer, at or above 98% of the target price, and submitted within the agreed timeframe.",
  },
  {
    question: 'What happens if I receive an offer that meets the target but choose not to accept it?',
    answer:
      "If a qualifying offer is received and declined, the commitment is considered fulfilled and standard commission terms apply. Our commitment is designed to ensure performance — not to override seller choice.",
  },
  {
    question: "What if my home doesn't qualify for this program?",
    answer:
      "Not every home is a fit. Factors like condition, location, pricing expectations, and market dynamics all matter. If your home doesn't qualify, we'll explain why and outline your best available options — with no obligation.",
  },
  {
    question: 'What if the market analysis suggests a lower price than expected?',
    answer:
      "Our market analysis reflects current market conditions and real comparable sales data. If the analysis suggests a price significantly different from your expectations, we'll review the findings with you and determine the best pricing strategy together.",
  },
  {
    question: "Does this mean you're guaranteeing my home will sell?",
    answer:
      "No. We commit to our performance — specifically, securing a qualifying offer within the defined range. The final decision to accept any offer always remains with you.",
  },
  {
    question: 'How long does the commitment last?',
    answer:
      "The commitment period begins once your home goes live on the market and lasts for the timeframe outlined in your listing agreement, typically up to 60 days.",
  },
  {
    question: 'What if I cancel the listing early?',
    answer:
      "If the listing is terminated before the commitment period ends, the commitment no longer applies. Standard cancellation terms as outlined in the listing agreement will apply.",
  },
  {
    question: 'Are there requirements I need to meet as the seller?',
    answer:
      "Yes. To ensure the best possible outcome, sellers must: Follow the agreed pricing strategy, allow reasonable showing access, maintain the home's condition, complete agreed-upon prep or repairs, and respond to offers in good faith. These conditions are clearly outlined upfront.",
  },
  {
    question: 'What if the inspection uncovers major issues?',
    answer:
      "If material issues are discovered that significantly impact value or marketability, we'll reassess the pricing strategy and target price together. Transparency protects both sides.",
  },
  {
    question: 'How is this different from a traditional listing?',
    answer:
      "Most traditional listings rely on estimates, opinions, and hope. Our approach establishes a clear target price upfront, launches with a defined plan, and puts our commission at risk if we don't perform. It's a more structured, accountable way to sell.",
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
