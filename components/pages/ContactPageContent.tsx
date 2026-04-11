"use client";

// Imports
import { useToast } from "@/contexts/ToastContext";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";

// Main component
export default function ContactPageContent() {
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Toast hook
  const { addToast } = useToast();

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // update field
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // prevent reload
    addToast("Thank you! We will get back to you soon.", "success"); // show message
    setFormData({ name: "", email: "", subject: "", message: "" }); // reset form
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            {/* Title */}
            <h1 className="text-5xl font-bold text-blue-600 mb-4">
              Contact Us
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600">
              Have a question? We would love to hear from you. Send us a message
              and we will respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
          {/* Contact info */}
          <div className="space-y-8">
            {/* Email */}
            <div className="flex gap-4">
              <Mail
                aria-hidden="true"
                className="w-6 h-6 text-blue-600 flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-blue-600 mb-1">Email</h3>
                <p className="text-gray-600">support@bazarna.com</p>
                <p className="text-gray-600">orders@bazarna.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <Phone
                aria-hidden="true"
                className="w-6 h-6 text-blue-600 flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-blue-600 mb-1">Phone</h3>
                <p className="text-gray-600">+20 1104894017</p>
                <p className="text-gray-600">
                  Saturday - Thursday: 9:00 AM - 4:00 PM
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <MapPin
                aria-hidden="true"
                className="w-6 h-6 text-blue-600 flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-blue-600 mb-1">Address</h3>
                <p className="text-gray-600">123 AL-SALAM Street</p>
                <p className="text-gray-600">Maghagha, Minya</p>
              </div>
            </div>

            {/* Working hours */}
            <div className="flex gap-4">
              <Clock
                aria-hidden="true"
                className="w-6 h-6 text-blue-600 flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-blue-600 mb-1">Hours</h3>
                <p className="text-gray-600">
                  Saturday - Thursday: 9:00 AM - 4:00 PM
                </p>
                <p className="text-gray-600">Friday: 2:00 PM - 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  aria-label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="px-4 py-3 border rounded-lg ring-gray-500 outline-none ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  aria-label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="px-4 py-3 border rounded-lg ring-gray-500 outline-none ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Subject */}
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                aria-label="Subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg ring-gray-500 outline-none ring-2 focus:ring-blue-500"
                required
              />

              {/* Message */}
              <textarea
                name="message"
                placeholder="Your Message"
                aria-label="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border rounded-lg ring-gray-500 outline-none ring-2 focus:ring-blue-500 resize-none"
                required
              />

              {/* Submit button */}
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
