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
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Fields config
const fields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    colSpan: "col-span-1",
    autoComplete: "given-name",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    colSpan: "col-span-1",
    autoComplete: "family-name",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    colSpan: "col-span-2",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    colSpan: "col-span-2",
    autoComplete: "tel",
  },
  {
    name: "address",
    label: "Street Address",
    type: "text",
    colSpan: "col-span-2",
    autoComplete: "address-line1",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    colSpan: "col-span-1",
    autoComplete: "address-level2",
  },
  {
    name: "postalCode",
    label: "Postal Code",
    type: "text",
    colSpan: "col-span-1",
    autoComplete: "postal-code",
  },
] as const;

// Main component
export default function CheckoutForm({
  formData,
  handleInputChange,
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
          {fields.map((field) => (
            <div key={field.name} className={field.colSpan}>

              {/* Input */}
              <input
                id={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.label}
                aria-label={field.label}
                value={formData[field.name]}
                onChange={handleInputChange}
                autoComplete={field.autoComplete}
                required
                className="w-full px-4 py-3 border rounded-lg ring-gray-500 outline-none ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
