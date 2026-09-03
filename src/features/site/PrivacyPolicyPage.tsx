import { LegalPageLayout } from "./LegalPageLayout";

export function PrivacyPolicyPage() {
  return (
    <LegalPageLayout testId="privacy-policy-page" title="Privacy Policy">
      <p>
        Forno Rosso Pizzeria collects only the information needed to take,
        prepare, and deliver your order: your name, delivery address, phone
        number, and payment details.
      </p>
      <p>
        We never sell your personal information to third parties. Delivery
        details are shared with our delivery partners solely to fulfil your
        order.
      </p>
      <p>
        You may contact us at any time to review, update, or request removal
        of the personal information we hold about you.
      </p>
    </LegalPageLayout>
  );
}
