import React from "react";

// Interface for form data
interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

// Props for the component
interface CheckoutFormProps {
  formData: CheckoutFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // input handler
  isProcessing: boolean;
}

// Main component
export default function CheckoutForm({
  formData,
  handleInputChange,
  isProcessing,
}: CheckoutFormProps) {
  return (
    <section className="space-y-8">
      {/* Form container */}
      <section className="border rounded-lg p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          Shipping Information
        </h2>

        {/* Inputs grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="col-span-1 px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-gray-300 focus:ring-blue-500"
          />

          {/* Last Name */}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="col-span-1 px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-gray-300 focus:ring-blue-500"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="col-span-2 px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-gray-300 focus:ring-blue-500"
          />

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="col-span-2 px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-gray-300 focus:ring-blue-500"
          />

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="col-span-2 px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-gray-300 focus:ring-blue-500"
          />

          {/* City */}
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="col-span-1 px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-gray-300 focus:ring-blue-500"
          />

          {/* Postal Code */}
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleInputChange}
            required
            className="col-span-1 px-4 py-3 border rounded-lg focus:outline-none ring-2 ring-gray-300 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold text-lg transition-colors"
      >
        {isProcessing ? "Processing..." : "Submit"} {/* dynamic text */}
      </button>
    </section>
  );
}
