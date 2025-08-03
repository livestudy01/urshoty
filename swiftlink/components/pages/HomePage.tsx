
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import CopyIcon from '../icons/CopyIcon';
import CheckIcon from '../icons/CheckIcon';
import type { LinkItem } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Label from '../ui/Label';


const ResultCard: React.FC<{ newLink: LinkItem }> = ({ newLink }) => {
    const [copied, setCopied] = useState(false);
    const shortUrl = `${import.meta.env.VITE_BACKEND_URL}/r/${newLink.shortCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl mt-8"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Your Link is Ready!</CardTitle>
                    <CardDescription className="truncate">
                        Original: <a href={newLink.longUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{newLink.longUrl}</a>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Input value={shortUrl} readOnly className="font-mono text-lg" />
                        <Button onClick={handleCopy} className="w-24">
                            {copied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
                            <span className="ml-2">{copied ? 'Copied' : 'Copy'}</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const HomePage: React.FC = () => {
    const [longUrl, setLongUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [result, setResult] = useState<LinkItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { addLink, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const displayPrefix = useMemo(() => {
        try {
            const url = new URL(import.meta.env.VITE_BACKEND_URL || window.location.origin);
            return `${url.hostname}/r/`;
        } catch (e) {
            return 'your-domain.com/r/';
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!longUrl) {
            setError('Please enter a URL to shorten.');
            return;
        }

        if (!isLoggedIn) {
            setError('Please log in to create short links.');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }
        
        let urlToProcess = longUrl;
        if (!/^https?:\/\//i.test(urlToProcess)) {
            urlToProcess = `https://${urlToProcess}`;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const newLink = await addLink(urlToProcess, customSlug);
            setResult(newLink);
            setLongUrl('');
            setCustomSlug('');
        } catch (err: any) {
            setError(err.message || 'An error occurred. The custom alias might be taken.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                    SwiftLink Shortener
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                    Enter a long URL to generate a short, powerful link. Easy and fast.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-2xl mt-8"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid gap-2">
                         <Label htmlFor="longUrl">Destination URL</Label>
                         <Input
                            id="longUrl"
                            type="url"
                            placeholder="https://your-long-url.com/goes-here"
                            value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                            required
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="customSlug">Custom Slug (Optional)</Label>
                        <div className="flex items-center">
                            <span className="text-muted-foreground bg-secondary px-3 py-2 rounded-l-md border border-r-0 border-input">{displayPrefix}</span>
                            <Input
                                id="customSlug"
                                type="text"
                                placeholder="my-awesome-link"
                                value={customSlug}
                                onChange={(e) => setCustomSlug(e.target.value)}
                                className="rounded-l-none"
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                        ) : (
                            'Shorten Link'
                        )}
                    </Button>
                </form>
                 {error && <p className="text-destructive text-sm mt-2 text-center">{error}</p>}
            </motion.div>

            {result && <ResultCard newLink={result} />}
        </div>
    );
};

export default HomePage;
