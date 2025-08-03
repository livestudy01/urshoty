import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Label from '../ui/Label';
import Checkbox from '../ui/Checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import GoogleIcon from '../icons/GoogleIcon';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};


const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signUp, googleLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
        setError('You must agree to the privacy policy.');
        return;
    }
    setError('');
    setLoading(true);
    try {
      await signUp(email, password, name);
      setSuccess(true);
    } catch (err: any) {
        setError(err.message || 'Failed to create account. Please try again.');
    } finally {
        setLoading(false);
    }
  };

  if (success) {
      return (
          <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-secondary/40 px-4 py-8">
               <Card className="w-full max-w-sm">
                   <CardHeader>
                       <CardTitle className="text-2xl">Account Created!</CardTitle>
                       <CardDescription>
                           We've sent a verification link to your email address. Please check your inbox to complete the registration.
                       </CardDescription>
                   </CardHeader>
                   <CardFooter>
                       <Button asChild className="w-full">
                           <Link to="/login">Back to Login</Link>
                       </Button>
                   </CardFooter>
               </Card>
          </div>
      )
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-secondary/40 px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        <Card>
          <CardHeader>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl">Create an account</CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription>
                Enter your details below to create your account.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <motion.div variants={itemVariants}>
                <Button variant="outline" className="w-full" type="button" onClick={googleLogin}>
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Sign up with Google
                </Button>
              </motion.div>
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </motion.div>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <motion.div variants={itemVariants} className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreed} onCheckedChange={setAgreed} />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link to="/privacy" className="underline text-primary hover:text-primary/80">
                    Privacy Policy
                  </Link>
                </Label>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full" disabled={loading || !agreed || !email || !password || !name}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </motion.div>
            </CardContent>
          </form>
          <CardFooter>
            <motion.div variants={itemVariants} className="text-center text-sm text-muted-foreground w-full">
              Already have an account?{" "}
              <Link to="/login" className="underline text-primary">
                Login
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
