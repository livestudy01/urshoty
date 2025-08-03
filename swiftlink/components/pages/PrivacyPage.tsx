import React from 'react';
import { motion } from 'framer-motion';

const PrivacySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3 text-primary">{title}</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
            {children}
        </div>
    </div>
);


const PrivacyPage: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-background"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                        <p className="mt-4 text-lg text-muted-foreground">Last updated: July 27, 2024</p>
                    </div>

                    <PrivacySection title="Introduction">
                        <p>
                            Welcome to SwiftLink ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our URL shortener service.
                        </p>
                    </PrivacySection>

                    <PrivacySection title="Information We Collect">
                        <p>
                            We may collect information about you in a variety of ways. The information we may collect via the Service includes:
                        </p>
                        <ul className="list-disc list-inside space-y-2">
                             <li>
                                <strong>Personal Data:</strong> We collect personal information, such as your name and email address, when you register for an account.
                            </li>
                            <li>
                                <strong>URL Data:</strong> We collect the original long URLs you submit to our service and store them in association with your account to provide you with our link management features.
                            </li>
                            <li>
                                <strong>Usage Data:</strong> We may automatically collect information when you access and use the Service. This may include your IP address, browser type, operating system, and data on which links are clicked for analytics.
                            </li>
                        </ul>
                    </PrivacySection>
                    
                    <PrivacySection title="Use of Your Information">
                        <p>
                            Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
                        </p>
                         <ul className="list-disc list-inside space-y-2">
                            <li>Create and manage your account.</li>
                            <li>Generate short links from your long URLs.</li>
                            <li>Display your link history and analytics.</li>
                            <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
                        </ul>
                    </PrivacySection>

                    <PrivacySection title="Third-Party Services">
                        <p>
                            This is a demonstration application and does not integrate with any third-party services for data processing other than for authentication purposes if you choose to sign in with a third-party provider.
                        </p>
                    </PrivacySection>
                    
                    <PrivacySection title="Security of Your Information">
                        <p>
                            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
                        </p>
                    </PrivacySection>

                    <PrivacySection title="Changes to This Privacy Policy">
                        <p>
                            We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page.
                        </p>
                    </PrivacySection>
                </div>
            </div>
        </motion.div>
    );
};

export default PrivacyPage;