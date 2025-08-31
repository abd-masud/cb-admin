import Image from "next/image";
import logo from "../../../public/images/logo.webp";
import Link from "next/link";

export const PrivacyPolicyComponent = () => {
  return (
    <main className="bg-home_bg min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-lg shadow-lg px-6 py-8 sm:px-10 sm:py-12">
          <div className="flex justify-center mb-8">
            <Link href="/">
              <div className="flex items-center justify-center space-x-3">
                <Image
                  className="h-10 w-10"
                  priority
                  src={logo}
                  height={40}
                  width={40}
                  alt="Copa Business Logo"
                />
                <p className="text-black font-bold text-2xl sm:text-3xl">
                  Copa Business
                </p>
              </div>
            </Link>
          </div>

          <h1 className="text-center text-4xl sm:text-5xl font-bold text-gray-900 mb-10 pb-6 border-b border-gray-200">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-10">
            <p className="text-lg leading-8 text-gray-600">
              This Privacy Policy explains how Copa Business collects, uses, and
              protects your information when you use our platform. Please read
              this policy carefully to understand our practices regarding your
              personal data.
            </p>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900">
                1. Information We Collect
              </h2>
              <p className="text-gray-600">
                We may collect the following information:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  <span className="font-medium">Personal Data:</span> Name,
                  email address, company name, and billing information
                </li>
                <li>
                  <span className="font-medium">Usage Data:</span> Login times,
                  IP addresses, browser types, and pages visited
                </li>
                <li>
                  <span className="font-medium">Content Data:</span> Information
                  you input into our CMS, accounting, and HR modules
                </li>
              </ul>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 ">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600">Your information helps us to:</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and manage your subscription</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Monitor and enhance platform security and integrity</li>
                <li>Send important service-related notices and updates</li>
              </ul>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 ">
                3. Data Sharing
              </h2>
              <p className="text-gray-600">
                We value your privacy and do not sell your personal data. We may
                share information with:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  Trusted service providers (e.g., payment processors) who
                  assist in our operations under strict confidentiality
                  agreements
                </li>
                <li>
                  Legal authorities when required to comply with applicable laws
                  or regulations
                </li>
                <li>
                  Business partners in case of mergers, acquisitions, or asset
                  sales, with proper notice
                </li>
              </ul>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 ">
                4. Data Security
              </h2>
              <p className="text-gray-600">
                We implement robust security measures including:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  Industry-standard encryption for data in transit and at rest
                </li>
                <li>
                  Secure data centers with physical and network protections
                </li>
                <li>Strict access controls and authentication protocols</li>
                <li>Regular security audits and vulnerability assessments</li>
              </ul>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 ">
                5. Cookies and Tracking
              </h2>
              <p className="text-gray-600">
                To enhance your experience, we use:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  <span className="font-medium">Essential cookies:</span>{" "}
                  Required for core functionality
                </li>
                <li>
                  <span className="font-medium">Analytics cookies:</span> Help
                  us understand how users interact with our platform
                </li>
                <li>
                  <span className="font-medium">Performance cookies:</span>{" "}
                  Improve service responsiveness
                </li>
              </ul>
              <p className="text-gray-600">
                You can manage cookies through your browser settings, though
                this may affect functionality.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 ">
                6. Your Rights
              </h2>
              <p className="text-gray-600">
                Under applicable privacy laws, you may:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>Request access to or a copy of your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent for data processing</li>
                <li>Request restriction of processing or data portability</li>
                <li>Lodge complaints with regulatory authorities</li>
              </ul>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 ">
                7. Data Retention
              </h2>
              <p className="text-gray-600">
                We retain your personal data only as long as necessary to:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>Provide the services you requested</li>
                <li>
                  Comply with legal obligations (e.g., tax, accounting
                  requirements)
                </li>
                <li>Resolve disputes and enforce our agreements</li>
              </ul>
              <p className="text-gray-600">
                Inactive accounts are typically deleted after 24 months of
                inactivity.
              </p>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 ">
                8. Third-Party Links
              </h2>
              <p className="text-gray-600">
                Our platform may contain links to external websites. We:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  Are not responsible for the content or privacy practices of
                  these sites
                </li>
                <li>
                  Recommend reviewing the privacy policy of any site you visit
                </li>
              </ul>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 ">
                9. Children&apos;s Privacy
              </h2>
              <p className="text-gray-600">
                Our services are designed for business users and are not
                intended for children under 18. We:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  Do not knowingly collect personal information from minors
                </li>
                <li>
                  Will delete any such information if we become aware of its
                  collection
                </li>
              </ul>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 ">
                10. Policy Changes
              </h2>
              <p className="text-gray-600">
                We may update this policy to reflect changes in our practices.
                When we do:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  We will update the &quot;Last Updated&quot; date at the top of
                  this policy
                </li>
                <li>
                  Material changes will be communicated via email or prominent
                  platform notices
                </li>
                <li>
                  Continued use after changes constitutes acceptance of the
                  revised policy
                </li>
              </ul>
            </section>

            <section className="space-y-5">
              <h2 className="text-2xl font-semibold text-gray-900 ">
                11. Contact Us
              </h2>
              <p className="text-gray-600">
                For privacy-related questions or to exercise your rights:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600">
                <li>
                  Email: <span className="font-medium">info@rafusoft.com</span>
                </li>
                <li>
                  Address:{" "}
                  <span className="font-medium">
                    Mirpur 11.5, Dhaka, Bangladesh
                  </span>
                </li>
                <li>
                  Response Time: We aim to respond to all inquiries within 5
                  business days
                </li>
              </ul>
              <p className="text-gray-600 mt-4">
                Last Updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};
