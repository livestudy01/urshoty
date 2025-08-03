import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Label from '../ui/Label';
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


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const { login, googleLogin, magicLinkLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // navigation is handled inside AuthContext
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setError('');
    if (!email) {
      setError('Please enter your email to receive a magic link.');
      return;
    }
    setLoading(true);
    try {
      await magicLinkLogin(email);
      setMagicLinkSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-secondary/40 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        <Card>
          <CardHeader>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl">Login</CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription>
                {magicLinkSent ? 'Check your email for the magic link!' : 'Enter your details below to login.'}
              </CardDescription>
            </motion.div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <motion.div variants={itemVariants}>
                <Button variant="outline" className="w-full" type="button" onClick={googleLogin}>
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Login with Google
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
              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </motion.div>
               <motion.div variants={itemVariants}>
                <Button type="button" variant="link" className="w-full" onClick={handleMagicLink} disabled={loading}>
                  {loading ? 'Sending...' : 'Email me a Magic Link'}
                </Button>
              </motion.div>
            </CardContent>
          </form>
          <CardFooter>
            <motion.div variants={itemVariants} className="text-center text-sm text-muted-foreground w-full">
              Don't have an account?{" "}
              <Link to="/signup" className="underline text-primary">
                Sign up
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
