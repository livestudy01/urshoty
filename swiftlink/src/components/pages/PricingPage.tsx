
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import CheckIcon from '../icons/CheckIcon';
import XIcon from '../icons/XIcon';
import { useAuth, apiFetch } from '../../contexts/AuthContext';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const Feature: React.FC<{ included: boolean; children: React.ReactNode }> = ({ included, children }) => (
  <li className="flex items-start gap-3">
    <div className="pt-1">
        {included ? (
        <CheckIcon className="h-4 w-4 text-green-500" />
        ) : (
        <XIcon className="h-4 w-4 text-destructive" />
        )}
    </div>
    <span className={!included ? 'text-muted-foreground line-through' : ''}>{children}</span>
  </li>
);

interface PricingCardProps {
  plan: string;
  price: string;
  pricePeriod: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  ctaAction: () => void;
  highlight?: boolean;
  badge?: string;
};

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, pricePeriod, description, features, cta, ctaAction, highlight = false, badge }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="w-full"
    >
        <Card className={`relative flex flex-col h-full ${highlight ? 'border-primary ring-2 ring-primary shadow-2xl' : 'shadow-lg'} overflow-hidden`}>
        {badge && (
            <div className="py-1.5 px-4 bg-primary text-primary-foreground text-sm font-semibold w-full text-center">
                {badge}
            </div>
        )}
        <CardHeader className="items-center text-center pt-8">
            <CardTitle className="text-2xl font-semibold">{plan}</CardTitle>
            <div className="flex items-baseline gap-1 mt-4">
            <span className="text-5xl font-bold tracking-tight">{price}</span>
            <span className="text-muted-foreground">{pricePeriod}</span>
            </div>
            <CardDescription className="mt-2 h-10">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <ul className="space-y-4 text-sm">
            {features.map((feature, index) => (
                <Feature key={index} included={feature.included}>
                {feature.text}
                </Feature>
            ))}
            </ul>
        </CardContent>
        <CardFooter className="p-6 mt-4">
            <Button onClick={ctaAction} className="w-full" size="lg" variant={highlight ? 'default' : 'outline'}>
                {cta}
            </Button>
        </CardFooter>
        </Card>
    </motion.div>
);


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};


const PricingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    
    const handlePayment = async (amount: number) => {
        if (!isLoggedIn || !user) {
            navigate('/login');
            return;
        }

        try {
            // 1. Create Order on Backend (now a protected route)
            const order = await apiFetch('/api/create-order', {
                method: 'POST',
                body: JSON.stringify({ amount: amount * 100 }) // Amount in paise
            });

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "SwiftLink",
                description: "Subscription Payment",
                order_id: order.id,
                handler: function (response: any){
                    alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
                    // Here you would typically verify the payment on your backend
                    // and then grant the user access to the plan features.
                    navigate('/dashboard');
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#1c2a4e" // primary color
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
        }
    };

    const pricingPlans = [
      {
        plan: 'Free',
        price: '₹0',
        pricePeriod: '/ month',
        description: 'For personal projects & just getting started.',
        features: [
          { text: '5 Links per Month', included: true },
          { text: 'Link Management Dashboard', included: true },
          { text: 'Basic Analytics', included: true },
          { text: 'Custom Aliases', included: false },
          { text: 'Priority Support', included: false },
        ],
        cta: 'Get Started',
        ctaAction: () => navigate('/signup'),
      },
      {
        plan: 'Monthly',
        price: '₹29',
        pricePeriod: '/ month',
        description: 'For professionals who need flexibility.',
        features: [
          { text: 'Unlimited Links', included: true },
          { text: 'Link Management Dashboard', included: true },
          { text: 'Custom Aliases', included: true },
          { text: 'Detailed Analytics & Reports', included: true },
          { text: 'Priority Support', included: true },
        ],
        cta: 'Choose Monthly',
        ctaAction: () => handlePayment(29),
        highlight: true,
        badge: 'Most Flexible',
      },
      {
        plan: 'Yearly',
        price: '₹299',
        pricePeriod: '/ year',
        description: 'For committed users who want the best value.',
        features: [
            { text: 'Includes all "Monthly" features', included: true },
            { text: 'Save over 15% compared to monthly', included: true },
            { text: 'Billed once annually', included: true },
            { text: 'Dedicated yearly support queue', included: true },
        ],
        cta: 'Choose Yearly',
        ctaAction: () => handlePayment(299),
      },
    ];

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-primary">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Choose the plan that's right for you. No hidden fees, cancel anytime.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl w-full items-stretch"
        >
        {pricingPlans.map((plan, index) => (
            <motion.div variants={itemVariants} key={index} className="flex">
                <PricingCard {...plan} />
            </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PricingPage;