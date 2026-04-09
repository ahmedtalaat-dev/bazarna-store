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

// Main component
export default function PaymentForm({
  paymentMethod,
  setPaymentMethod,
  formData,
  handleInputChange,
}: PaymentFormProps) {
  return (
    <section className="border rounded-lg p-6">
      
      {/* Title */}
      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        Payment Method
      </h2>

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
            
            {/* Cardholder name */}
            <input
              type="text"
              name="cardName"
              placeholder="Cardholder Name"
              value={formData.cardName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Card number */}
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number (1234 5678 9012 3456)"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Expiry + CVC */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Expiry date */}
              <input
                type="text"
                name="cardExpiry"
                placeholder="MM/YY"
                value={formData.cardExpiry}
                onChange={handleInputChange}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* CVC */}
              <input
                type="text"
                name="cardCVC"
                placeholder="CVC"
                value={formData.cardCVC}
                onChange={handleInputChange}
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
          <span className="font-semibold text-blue-600">
            Cash on Delivery
          </span>
        </label>

      </div>
    </section>
  );
}