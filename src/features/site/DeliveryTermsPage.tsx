import { LegalPageLayout } from "./LegalPageLayout";

export function DeliveryTermsPage() {
  return (
    <LegalPageLayout testId="delivery-terms-page" title="Delivery Terms">
      <p>
        Orders are delivered within our standard delivery radius during
        kitchen hours. Estimated delivery times are shown at checkout and may
        vary with demand and weather conditions.
      </p>
      <p>
        A delivery fee applies to all orders below our minimum order
        threshold; free delivery is offered above that threshold.
      </p>
      <p>
        If your order arrives incomplete, cold, or otherwise not as
        described, contact us right away so we can make it right.
      </p>
    </LegalPageLayout>
  );
}
