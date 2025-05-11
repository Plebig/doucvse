"use client";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  isFormOpen: boolean;
  onClose: () => void;
}

const ContactFormularPopUp = ({ isFormOpen, onClose }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isFormOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFormOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const email = {
      to: "kontakt@doucvse.cz",
      subject: "email ze stranky kontakt",
      text: `Jmeno: ${formData.name}\nEmail: ${formData.email}\nZprava: ${formData.message}\n`,
      html: `<b>Jmeno:</b> ${formData.name}<br><b>Email:</b> ${formData.email}<br><b>Zprava:</b> ${formData.message}<br>`,
    };

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      });

      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!isFormOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="relative bg-[#F3F8FF] shadow-lg rounded-2xl max-w-xl w-full p-8 space-y-6"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-800 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Kontaktujte nás
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
              Jméno
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0072FA] transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0072FA] transition"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 font-medium text-gray-700">
              Zpráva
            </label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0072FA] transition"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-[#FF0049] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition"
          >
            {status === "sending" ? "Odesílání..." : "Odeslat zprávu"}
          </button>

          {status === "sent" && (
            <p className="text-green-600 text-center font-medium">
              ✅ Zpráva byla úspěšně odeslána!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-center font-medium">
              ❌ Něco se pokazilo. Zkuste to prosím znovu.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactFormularPopUp;
