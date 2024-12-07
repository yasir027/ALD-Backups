import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>

      <p>
        At ALD Online, we respect your privacy and are committed to protecting
        your personal information. This Privacy Policy outlines how we collect,
        use, and protect your personal data.
      </p>

      <section>
        <h2>1. Information Collection</h2>
        <p>
          We collect personal data such as your email address, house address,
          name, and designation for in-house use only. We will not share your
          personal data with any third party except those assisting us with our
          operations, and they are bound by confidentiality agreements.
        </p>
      </section>

      <section>
        <h2>2. Data Protection</h2>
        <p>
          We have implemented security measures to protect your personal
          information from unauthorized access or breaches. All data is stored
          securely and can be updated or deleted upon your request.
        </p>
      </section>

      <section>
        <h2>3. User Rights</h2>
        <p>
          You have the right to access, modify, or request deletion of your
          personal data. If you wish to exercise these rights, please contact us
          at support@aldonline.com.
        </p>
      </section>

      <p>
        By using our Web Site, you consent to the collection and use of your
        personal data as described in this Privacy Policy.
      </p>

      <footer>
        <small>Last updated: December 2024</small>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
