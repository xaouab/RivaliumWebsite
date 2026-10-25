import { consentCategories, openCookieSettings } from "@/lib/consent";
import LegalLayout from "@/components/legal/LegalLayout";

const sections = [
    { id: "1-data-controller", title: "1. Data Controller" },
    { id: "2-information-we-collect", title: "2. Information We Collect" },
    { id: "3-legal-basis-for-processing", title: "3. Legal Basis for Processing" },
    { id: "4-how-we-use-your-information", title: "4. How We Use Your Information" },
    { id: "5-data-sharing-and-third-parties", title: "5. Data Sharing and Third Parties" },
    { id: "6-international-data-transfers", title: "6. International Data Transfers" },
    { id: "7-cookies-and-tracking-technologies", title: "7. Cookies and Tracking Technologies" },
    { id: "8-children-s-data", title: "8. Children’s Data" },
    { id: "9-data-security", title: "9. Data Security" },
    { id: "10-your-gdpr-rights", title: "10. Your GDPR Rights" },
    { id: "11-data-retention", title: "11. Data Retention" },
    { id: "12-changes-to-this-privacy-notice", title: "12. Changes to This Privacy Notice" },
];

export default function PrivacyNotice() {
  return <LegalLayout title="Privacy Notice" revised="January 11, 2025" sections={sections}>

            
            <p>
              Welcome to Rivalium, developed by Kaura Interactive! This Privacy Notice explains how Kaura Interactive, as the data controller, collects, uses, stores, and protects your personal information when you access and use Rivalium and related services. We are committed to complying with the General Data Protection Regulation (GDPR) and other applicable EU data protection laws. Please read this notice carefully to understand our practices regarding your personal data.
            </p>
            <p>
              For any questions about this Privacy Notice or our data practices, please contact our Data Protection Officer at <a href="mailto:support@rivalium.online">support@rivalium.online</a>.
            </p>

            <h2 id="1-data-controller">1. Data Controller</h2>
            <p>
              Kaura Interactive, a company registered in France, is the data controller responsible for your personal data. Our registered office is at Toulouse, France.
            </p>

            <h2 id="2-information-we-collect">2. Information We Collect</h2>
            <p>
              We collect various types of information to provide and improve Rivalium. The categories of data we collect are:
            </p>
            <ul>
              <li><strong>Personal Information:</strong> Email address, username, hashed password, and, for in-game purchases, billing details (e.g., name, billing address, phone number).</li>
              <li><strong>Device Information:</strong> Device type, operating system, IP address, browser type, and other technical data necessary for gameplay and troubleshooting.</li>
              <li><strong>Usage Data:</strong> In-game playtime, interactions, and performance metrics to personalize your experience and improve services.</li>
              <li><strong>Transaction Data:</strong> Details of in-game purchases, including items purchased, transaction amount, and payment method (excluding sensitive payment details like credit card numbers, which are handled by third-party payment processors).</li>
              <li><strong>Cookies and Tracking Data:</strong> Information collected via cookies and similar technologies to enhance user experience and analyze service usage (see Section 7 for details).</li>
            </ul>

            <h2 id="3-legal-basis-for-processing">3. Legal Basis for Processing</h2>
            <p>
              We process your personal data based on the following legal grounds under GDPR:
            </p>
            <ul>
              <li><strong>Contractual Necessity:</strong> To provide Rivalium services, manage your account, and process in-game purchases (Article 6(1)(b) GDPR).</li>
              <li><strong>Legitimate Interests:</strong> To improve our services, troubleshoot technical issues, and personalize your gaming experience (Article 6(1)(f) GDPR).</li>
              <li><strong>Consent:</strong> For marketing communications and certain non-essential cookies, where you have provided explicit consent (Article 6(1)(a) GDPR).</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws, such as tax or consumer protection regulations (Article 6(1)(c) GDPR).</li>
            </ul>

            <h2 id="4-how-we-use-your-information">4. How We Use Your Information</h2>
            <p>
              We use your data to:
            </p>
            <ul>
              <li>Create and manage your Rivalium account.</li>
              <li>Authenticate your identity for secure logins.</li>
              <li>Send essential notifications (e.g., account recovery, service updates) and, with your consent, marketing communications.</li>
              <li>Personalize in-game features, such as leaderboards and customized content.</li>
              <li>Process in-game purchases securely via third-party payment gateways.</li>
              <li>Troubleshoot technical issues and improve Rivalium’s performance.</li>
              <li>Analyze usage patterns to enhance user experience (subject to your cookie preferences).</li>
            </ul>

            <h2 id="5-data-sharing-and-third-parties">5. Data Sharing and Third Parties</h2>
            <p>
              We may share your data with:
            </p>
            <ul>
              <li><strong>Third-Party Processors:</strong> Trusted partners, such as payment processors and cloud service providers, who process data on our behalf under strict data protection agreements compliant with GDPR.</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our legal rights (e.g., responding to lawful requests from public authorities).</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity, with appropriate safeguards in place.</li>
            </ul>
            <p>
              We do not sell your personal data to third parties.
            </p>

            <h2 id="6-international-data-transfers">6. International Data Transfers</h2>
            <p>
              If your data is transferred outside the European Economic Area (EEA), we ensure it is protected by appropriate safeguards, such as Standard Contractual Clauses (SCCs) approved by the European Commission or adequacy decisions for specific countries.
            </p>

            <h2 id="7-cookies-and-tracking-technologies">7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar browser storage. Essential storage is required for Rivalium’s website to work and needs no consent. Everything else is off until you allow it in the cookie notice, and you can change or withdraw your choice at any time from <button type="button" className="underline underline-offset-4" onClick={openCookieSettings}>Cookie settings</button> (also in the footer of every page). Your choice is kept for 6 months, then we ask again.
            </p>
            <table>
              <thead><tr><th scope="col">Category</th><th scope="col">Purpose</th><th scope="col">What is stored</th></tr></thead>
              <tbody>
                {consentCategories.map(category => <tr key={category.id}>
                  <td><strong>{category.label}</strong>{category.locked ? " (always on)" : ""}</td>
                  <td>{category.text}</td>
                  <td>{category.examples}</td>
                </tr>)}
              </tbody>
            </table>
            <p>
              Browsers that send a Global Privacy Control signal start with every optional category turned off.
            </p>

            <h2 id="8-children-s-data">8. Children’s Data</h2>
            <p>
              Rivalium is not intended for users under 16. We do not knowingly collect personal data from children under 16 without verifiable parental consent. If we learn that a user under 16 has provided personal data without consent, we will delete it promptly. Contact us at <a href="mailto:support@rivalium.online">support@rivalium.online</a> if you believe we have collected data from a minor.
            </p>

            <h2 id="9-data-security">9. Data Security</h2>
            <p>
              We implement robust security measures to protect your data:
            </p>
            <ul>
              <li><strong>Encryption:</strong> Passwords are hashed using industry-standard algorithms, and data transmissions use TLS encryption.</li>
              <li><strong>Secure Storage:</strong> Data is stored in secure databases with restricted access, protected by industry-standard protocols.</li>
              <li><strong>Payment Security:</strong> Payment data is processed by PCI DSS-compliant third-party gateways, and we do not store sensitive payment details.</li>
            </ul>

            <h2 id="10-your-gdpr-rights">10. Your GDPR Rights</h2>
            <p>
              Under GDPR, you have the following rights regarding your personal data:
            </p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data.</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> Request deletion of your data. Note that deleting your account anonymizes personal data, retaining only non-personal in-game statistics for historical purposes.</li>
              <li><strong>Restriction:</strong> Request restriction of data processing in certain circumstances.</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Object:</strong> Object to processing based on legitimate interests or for direct marketing.</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for processing (e.g., marketing emails) at any time.</li>
              <li><strong>Lodge a Complaint:</strong> Contact your local data protection authority if you believe your rights have been violated.</li>
            </ul>
            <p>
              To exercise these rights, contact us at <a href="mailto:support@rivalium.online">support@rivalium.online</a>. We will respond within one month, as required by GDPR.
            </p>

            <h2 id="11-data-retention">11. Data Retention</h2>
            <p>
              We retain personal data only as long as necessary for the purposes outlined in this notice:
            </p>
            <ul>
              <li>Account data is retained while your account is active. Upon deletion, personal data is anonymized, and non-personal statistics may be retained indefinitely.</li>
              <li>Transaction data is kept for 7 years to comply with tax and financial regulations.</li>
              <li>Usage data is retained for up to 2 years for analytics and service improvement.</li>
            </ul>

            <h2 id="12-changes-to-this-privacy-notice">12. Changes to This Privacy Notice</h2>
            <p>
              We may update this Privacy Notice to reflect changes in our practices or legal requirements. Significant changes will be communicated via email and by updating this page with a new “Last Revised” date. We encourage you to review this notice periodically.
            </p>
  </LegalLayout>;
}
