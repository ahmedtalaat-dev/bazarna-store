export default function PaymentForm() {
  return (
    <section className="border rounded-lg p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Payment Method</h2>
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
        <input
          type="radio"
          name="paymentMethod"
          value="cash"
          checked
          readOnly
          aria-label="Cash on Delivery"
          className="w-4 h-4 accent-blue-600"
        />
        <span className="font-semibold text-blue-600">Cash on Delivery</span>
      </div>
      <p className="text-sm text-gray-600 mt-3">
        Pay for your order when it arrives.
      </p>
    </section>
  );
}
