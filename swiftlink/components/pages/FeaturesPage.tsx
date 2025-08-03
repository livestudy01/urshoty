
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import BarChartIcon from '../icons/BarChartIcon';
import EditIcon from '../icons/EditIcon';
import UserIcon from '../icons/UserIcon';
import CheckIcon from '../icons/CheckIcon';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
  <Card className="text-center hover:shadow-lg transition-shadow duration-300">
    <CardHeader className="items-center">
      <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
        {icon}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription className="mt-2">{description}</CardDescription>
    </CardHeader>
  </Card>
);

const features = [
  {
    title: 'Powerful Dashboard',
    description: 'Manage all your links in one place. View, edit, and delete links with ease.',
    icon: <UserIcon className="h-8 w-8" />,
  },
  {
    title: 'Detailed Analytics',
    description: 'Track every click and measure your link performance with our detailed analytics.',
    icon: <BarChartIcon className="h-8 w-8" />,
  },
  {
    title: 'Custom Aliases',
    description: 'Create branded, memorable short links with custom aliases that reflect your content.',
    icon: <EditIcon className="h-8 w-8" />,
  },
  {
    title: 'Reliable & Fast',
    description: 'Our service is built for speed and reliability, ensuring your links are always accessible.',
    icon: <CheckIcon className="h-8 w-8" />,
  },
];

const FeaturesPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-primary">
          Features Built for You
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
          Everything you need to create, share, and track your links.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full"
      >
        {features.map((feature, index) => (
          <motion.div variants={itemVariants} key={index}>
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturesPage;
