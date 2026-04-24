"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Phone,
  Mail,
  User,
  MessageSquare,
  Package,
  AlertCircle,
} from "lucide-react";

import { usePackages } from "@/hooks/queries/usePackages";
import { useToast } from "@/components/ui/toast";
import { createContactMessage } from "@/services/contactService";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackage?: string;
}

export function ContactModal({
  isOpen,
  onClose,
  initialPackage,
}: ContactModalProps) {
  const { data: packages = [] } = usePackages();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    package: initialPackage || "",
  });

  useEffect(() => {
    if (initialPackage) {
      setFormData((prev) => ({ ...prev, package: initialPackage }));
    }
  }, [initialPackage]);

  // Clear error when inputs change
  useEffect(() => {
    if (error) setError(null);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email && !formData.phone) {
      const msg = "Please provide at least an email or a phone number.";
      setError(msg);
      addToast(msg, "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        packageName: formData.package,
      });

      addToast("Message sent! We'll get back to you soon.", "success");
      onClose();
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        package: "",
      });
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        "Failed to send message. Please try again.";
      setError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative h-32 bg-linear-to-br from-blue-600 to-purple-700 p-8">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              >
                <X className="size-5" />
              </button>
              <h2 className="text-2xl md:text-3xl font-clash font-bold text-white mb-1 tracking-wide">
                Got Questions?
              </h2>
              <p className="text-white/80 font-helvetica text-sm md:text-base">
                Let us contact you.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs  text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <User className="size-3" /> Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs  text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="size-3" /> Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs  text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <Phone className="size-3" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="+233 ..."
                  />
                </div>

                {/* Package Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs  text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <Package className="size-3" /> Package
                  </label>
                  <select
                    value={formData.package}
                    onChange={(e) =>
                      setFormData({ ...formData, package: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                  >
                    <option
                      value=""
                      disabled
                      className="bg-neutral-900 text-white/50"
                    >
                      Select a package
                    </option>
                    {packages.map((pkg) => (
                      <option
                        key={pkg.id}
                        value={pkg.name}
                        className="bg-neutral-900 text-white"
                      >
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs  text-white/50 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="size-3" /> Message
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs md:text-sm py-2.5 px-3 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-clash font-bold py-3 rounded-lg hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50   tracking-wide"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="size-5 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Send className="size-4" /> Send Message
                  </>
                )}
              </button>

              <p className="text-sm text-center text-white/30 tracking-wide">
                * Please provide at least an email or a phone number so we can
                reach you.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
