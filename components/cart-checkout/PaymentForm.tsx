// Props interface
interface PaymentFormProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  formData: {
    cardName: string;
    cardNumber: string;
    cardExpiry: string;
    cardCVC: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Inputs config
const cardFields = [
  {
    name: "cardName",
    type: "text",
    placeholder: "Cardholder Name",
    ariaLabel: "Cardholder Name",
  },
  {
    name: "cardNumber",
    type: "text",
    placeholder: "Card Number (1234 5678 9012 3456)",
    ariaLabel: "Card Number",
  },
  {
    name: "cardExpiry",
    type: "text",
    placeholder: "MM/YY",
    ariaLabel: "Card Expiry Date",
  },
  {
    name: "cardCVC",
    type: "text",
    placeholder: "CVC",
    ariaLabel: "Card CVC",
  },
] as const;

// Main Page
export default function PaymentForm({
  paymentMethod,
  setPaymentMethod,
  formData,
  handleInputChange,
}: PaymentFormProps) {
  return (
    <section className="border rounded-lg p-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-blue-600 mb-6">Payment Method</h2>

      {/* Payment options */}
      <div className="space-y-4">
        {/* Card option */}
        <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          {/* Credit Radio input */}
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-4 h-4 accent-blue-600"
          />

          {/* Label text */}
          <span className="font-semibold text-blue-600">
            Credit / Debit Card
          </span>
        </label>

        {/* Credit Card form */}
        {paymentMethod === "card" && (
          <div className="ml-8 space-y-4 bg-gray-50 p-4 rounded-lg">
            {/* Inputs */}
            {cardFields.map((field) => (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                aria-label={field.ariaLabel}
                className="w-full px-4 py-3 border rounded-lg ring-gray-500 outline-none ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
        )}

        {/* Cash on Delivery option */}
        <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
          {/* Cash on Delivery Radio input */}
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"} // selected check
            onChange={(e) => setPaymentMethod(e.target.value)} // update state
            className="w-4 h-4 accent-blue-600"
          />

          {/* Label text */}
          <span className="font-semibold text-blue-600">Cash on Delivery</span>
        </label>
      </div>
    </section>
  );
}
