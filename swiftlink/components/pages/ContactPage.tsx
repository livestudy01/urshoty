import React from 'react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

const ContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.h1 variants={itemVariants} className="text-4xl font-bold tracking-tight">
          Contact Us
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Have questions, feedback, or need support? Fill out the form below, and our team will get back to you as soon as possible.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
        className="mt-12 max-w-4xl mx-auto"
      >
        <div className="aspect-w-3 aspect-h-4 md:aspect-w-4 md:aspect-h-3 rounded-lg overflow-hidden shadow-lg border relative bg-white">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSclZpLz4Ua2yTCTAM3n0cYA-4qYq2vYpSCQxJz1qYy5qYgTzA/viewform?embedded=true"
            width="100%"
            height="100%"
            className="absolute inset-0 w-full h-full border-0"
            title="Contact Us Form"
          >
            Loading…
          </iframe>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Please replace the `src` in the iframe with your own Google Form link.
        </p>
      </motion.div>
    </div>
  );
};

export default ContactPage;