import React from "react";
import "./RefundAndCancellationPolicy.css";

const RefundAndCancellationPolicy = () => {
  return (
    <div className="refund-container">
      <h1>Refund and Cancellation Policy</h1>

      <p>
        We understand that our users may need to cancel or request refunds
        under certain circumstances. Below are the guidelines for refunds and
        cancellations.
      </p>

      <section>
        <h2>1. Subscription Refunds</h2>
        <p>
          Subscription payments are non-refundable, except in cases of
          technical issues. If a technical glitch occurs and cannot be fixed,
          you will be refunded. Refunds will be processed within 7 working days.
        </p>
      </section>

      <section>
        <h2>2. Cancellation</h2>
        <p>
          Users may cancel their subscription after the current period ends.
          You can cancel your subscription at any time before the next billing
          cycle begins. In case of cancellation, your personal data will be
          deleted upon request.
        </p>
      </section>

      <section>
        <h2>3. Refund Process</h2>
        <p>
          In case of a refund, the amount will be credited to your account
          within 7 working days after the cancellation request.
        </p>
      </section>

      <p>
        By using our services, you agree to abide by the terms of this Refund
        and Cancellation Policy.
      </p>
      <footer>
        <small>Last updated: December 2024</small>
      </footer>

    </div>
  );
};

export default RefundAndCancellationPolicy;
