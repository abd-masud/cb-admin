import { Subscription } from "@/types/subscription";
import React, { useState } from "react";

export const SubscriptionPlanCard = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const subscriptions: Subscription[] = [
    {
      name: "1 Month",
      price: 9.99,
      duration: "month",
      description: "Short-term commitment with full access",
      features: [
        "All free features",
        "Extended storage (50GB)",
        "Premium content access",
        "Priority support",
        "Ad-free experience",
      ],
      cta: "Subscribe Now",
    },
    {
      name: "6 Months",
      price: 7.99,
      duration: "month",
      description: "Great value with extra features",
      features: [
        "All 1-month features",
        "Extended storage (100GB)",
        "Advanced analytics",
        "Exclusive content",
        "24/7 priority support",
      ],
      cta: "Subscribe Now",
      popular: true,
      savings: "20%",
    },
    {
      name: "12 Months",
      price: 5.99,
      duration: "month",
      description: "Best value for long-term users",
      features: [
        "All 6-month features",
        "Unlimited storage",
        "Early access to new features",
        "Personal manager",
        "Customization options",
      ],
      cta: "Subscribe Now",
      popular: false,
      savings: "40%",
    },
  ];

  const faqData = [
    {
      question: "Can I switch plans at any time?",
      answer:
        "Yes, you can upgrade your plan at any time. When upgrading, you'll only pay the prorated difference for the remainder of your billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and in some regions, bank transfers.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer:
        "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, we'll refund your payment.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription anytime from your account settings. No additional fees will be charged after cancellation.",
    },
    {
      question: "Are there any hidden fees?",
      answer:
        "No, the price shown is all you pay. Taxes may be added depending on your location.",
    },
    {
      question: "Can I change my payment method?",
      answer:
        "Yes, you can update your payment method at any time from your account settings.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <main className="min-h-[calc(100vh-190px)] flex flex-col items-center justify-center bg-[#F2F4F7]">
      <div className="w-full mx-auto text-center sm:space-y-16 space-y-8 py-8">
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600">
            Select the subscription that works best for you. All plans include
            access to our core features with no hidden costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-8 gap-4 mt-8">
          {subscriptions.map((subscription, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                subscription.popular
                  ? "border-2 border-indigo-500 relative ring-2 ring-indigo-500/20 ring-offset-2"
                  : "border border-gray-200"
              }`}
            >
              {subscription.popular && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold uppercase py-0.5 px-2.5 absolute top-4 right-4 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              {subscription.savings && (
                <div className="absolute top-4 left-4 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  Save {subscription.savings}
                </div>
              )}

              <div className="p-8 pb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {subscription.name}
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  {subscription.description}
                </p>
                <div className="my-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${subscription.price}
                  </span>
                  {subscription.price > 0 && (
                    <span className="text-gray-600 text-lg">
                      /{subscription.duration}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-8 flex-grow">
                <ul className="space-y-4">
                  {subscription.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 text-left">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 pt-6">
                <button
                  className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    subscription.popular
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                      : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  {subscription.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 mx-auto">
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about our subscription plans and
              billing process.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100/50">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-100/80 last:border-b-0 group"
              >
                <button
                  className={`flex justify-between items-center w-full sm:p-7 p-4 text-left transition-all duration-500 ease-out ${
                    openFaqIndex === index
                      ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 shadow-inner"
                      : "hover:bg-gray-50/60 group-hover:shadow-sm"
                  }`}
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openFaqIndex === index}
                >
                  <div className="flex items-start space-x-4">
                    <h3
                      className={`sm:text-lg md:text-xl font-semibold transition-all duration-300 ${
                        openFaqIndex === index
                          ? "text-blue-800"
                          : "text-gray-800 group-hover:text-blue-700"
                      }`}
                    >
                      {faq.question}
                    </h3>
                  </div>
                  <svg
                    className={`w-6 h-6 transition-all duration-500 ease-out ${
                      openFaqIndex === index
                        ? "text-blue-600 rotate-180 scale-110"
                        : "text-gray-400 group-hover:text-blue-500 group-hover:scale-110"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`sm:px-7 px-3 overflow-hidden transition-all duration-300 ${
                    openFaqIndex === index
                      ? "py-3 max-h-96 opacity-100 bg-gray-50"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="bg-gradient-to-r from-blue-50/40 to-indigo-50/40 sm:p-6 p-3 rounded-2xl border border-blue-100/60 shadow-sm">
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 p-10 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-3xl border border-blue-100/50 shadow-lg backdrop-blur-sm">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
              Our dedicated support team is ready to help you with any
              additional questions you might have.
            </p>
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all hover:scale-105">
              <span className="flex items-center justify-center space-x-2">
                <span>Contact Support</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
