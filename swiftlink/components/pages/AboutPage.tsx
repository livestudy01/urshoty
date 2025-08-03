
import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-background"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">About SwiftLink</h1>
                    <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                        At SwiftLink, we believe in the power of simplicity. In a digital world cluttered with long, cumbersome URLs, we provide a clean, fast, and reliable solution to shorten, share, and track your links. Our mission is to make link management effortless for everyone, from individual creators to large enterprises.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto mt-16">
                     <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Our Values</h2>
                    </div>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">Simplicity</h3>
                            <p className="text-muted-foreground">We strive to create intuitive and easy-to-use tools that solve complex problems without the clutter.</p>
                        </div>
                         <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">Reliability</h3>
                            <p className="text-muted-foreground">You can count on us. Our infrastructure is built to be robust and available 24/7, ensuring your links are always active.</p>
                        </div>
                         <div className="p-4">
                            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                            <p className="text-muted-foreground">We are constantly exploring new ways to improve our service and provide more value to our users.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AboutPage;
