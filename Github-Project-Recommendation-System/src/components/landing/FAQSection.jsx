import React, { useState } from "react";
import "./FAQSection.css";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the AI matching work?",
      answer:
        "Our algorithm analyzes your tech stack, GitHub contributions, and difficulty preference to suggest projects that help you grow without being overwhelming.",
    },
    {
      question: "Is ProjectMatch free to use?",
      answer:
        "Absolutely! We are committed to helping developers build their portfolios. The core matching features will always be free.",
    },
    {
      question: "Can I submit my own open-source project?",
      answer:
        "Yes! Once you're signed in, you can go to your dashboard and submit a repository link for our AI to index and recommend to others.",
    },
  ];

  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2 className="faq-title">Common Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "active" : ""}`}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-icon">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
