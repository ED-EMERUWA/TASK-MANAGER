import React, { useState } from "react";
import { MapPin, Mail, Phone, MessageSquare, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would handle the form submission to your backend here
    console.log("Form submitted:", formState);
    
    // Show success message
    setSubmitted(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email",
      details: "support@taskflow.com",
      link: "mailto:support@taskflow.com"
    },
    {
      icon: <MapPin size={24} />,
      title: "Location",
      details: "San Francisco, CA",
      link: "https://maps.google.com"
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Social",
      details: "@taskflow",
      link: "https://twitter.com/taskflow"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navbar placeholder - use the same as in Home component */}
      <nav className="fixed w-full backdrop-blur-md bg-black/70 z-50 px-6 py-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600"></div>
            <span className="font-bold text-xl">TaskFlow</span>
          </div>
          {/* Navigation links - same as home page */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have a question or feedback? I'd love to hear from you. 
            Fill out the form below or reach out directly through any of the contact methods.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Contact Information
              </h2>
              <p className="text-gray-300 mb-8">
                Feel free to reach out with any questions, suggestions, or just to say hello. 
                I aim to respond to all inquiries within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <a 
                  key={index} 
                  href={item.link}
                  className="flex items-start group"
                >
                  <div className="mr-4 p-3 rounded-lg bg-gray-800 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">{item.title}</h3>
                    <p className="text-gray-400 group-hover:text-emerald-400 transition-colors">{item.details}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-8">
              <h3 className="text-xl font-semibold mb-4">Office Hours</h3>
              <div className="space-y-2 text-gray-300">
                <p>Monday - Friday: 9am - 6pm PST</p>
                <p>Saturday: 10am - 2pm PST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur opacity-20"></div>
            <div className="relative p-8 backdrop-blur-sm bg-gray-800/30 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
              
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <CheckCircle size={48} className="text-emerald-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-gray-300 text-center">
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="How can I help you?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Send Message <Send size={16} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              ["How quickly will I receive a response?", "I aim to respond to all inquiries within 24 hours during business days."],
              ["Do you offer custom development work?", "Yes, I can work on custom features or integrations for specific business needs. Please reach out with details of your requirements."],
              ["Is there a phone number for urgent matters?", "For urgent issues, premium users can access priority support through the dashboard."]
            ].map(([q, a], i) => (
              <div key={i} className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-emerald-500/30 transition-all duration-300">
                <h3 className="font-semibold text-white mb-2">{q}</h3>
                <p className="text-gray-300 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-xl overflow-hidden h-80">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-4 text-emerald-500" />
                <p className="font-medium">San Francisco, California</p>
                <p className="text-sm mt-2">Interactive map would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer placeholder - use the same as in Home component */}
      <footer className="px-6 py-12 border-t border-gray-800 bg-black">
        {/* Footer content - same as home page */}
      </footer>
    </div>
  );
};

export default Contact;