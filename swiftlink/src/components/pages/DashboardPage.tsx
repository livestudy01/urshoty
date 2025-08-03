
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth, apiFetch } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import Button from '../ui/Button';
import CopyIcon from '../icons/CopyIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';
import BarChartIcon from '../icons/BarChartIcon';
import { Link, useNavigate } from 'react-router-dom';
import TrendingUpIcon from '../icons/TrendingUpIcon';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const DashboardPage: React.FC = () => {
    const { user, links, deleteLink, isLoading: isAuthLoading, fetchLinks } = useAuth();
    const [clickData, setClickData] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const displayHostname = useMemo(() => {
        try {
            const url = new URL(backendUrl);
            // remove www. for cleaner display
            return url.hostname.replace(/^www\./, '');
        } catch {
            return 'your-domain.com';
        }
    }, [backendUrl]);

    const loadDashboardData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Fetch links and clicks in parallel for speed
            const [_, clicks] = await Promise.all([
                fetchLinks(),
                apiFetch('/api/clicks')
            ]);
            setClickData(clicks);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            // Optionally, set an error state to show a message to the user
        } finally {
            setIsLoading(false);
        }
    }, [user, fetchLinks]);

    useEffect(() => {
        if (!isAuthLoading && user) {
            loadDashboardData();
        } else if (!isAuthLoading && !user) {
            navigate('/login');
        }
    }, [user, isAuthLoading, navigate, loadDashboardData]);
    
    const totalClicks = useMemo(() => Object.values(clickData).reduce((acc, clicks) => acc + clicks, 0), [clickData]);

    const handleCopy = (shortCode: string) => {
        navigator.clipboard.writeText(`${backendUrl}/r/${shortCode}`);
        // Consider adding a brief "Copied!" confirmation message.
    };
    
    if (isAuthLoading || isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4">Loading your dashboard...</p>
            </div>
        )
    }

    if (!user) {
        return null; // Should have been redirected
    }
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            <h1 className="text-3xl font-bold tracking-tight mb-6">Welcome back, {user.name}!</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard title="Total Links" value={links.length.toString()} icon={<TrendingUpIcon className="h-4 w-4 text-muted-foreground" />} />
                <StatCard title="Total Clicks" value={totalClicks.toLocaleString()} icon={<BarChartIcon className="h-4 w-4 text-muted-foreground" />} />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Your Links</CardTitle>
                        <Button asChild>
                           <Link to="/">Create New Link</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {links.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">Original URL</TableHead>
                                    <TableHead>Short Link</TableHead>
                                    <TableHead>Clicks</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {links.map(link => (
                                    <TableRow key={link.id}>
                                        <TableCell className="font-medium truncate max-w-xs">
                                            <a href={link.longUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{link.longUrl}</a>
                                        </TableCell>
                                        <TableCell>
                                            <a href={`${backendUrl}/r/${link.shortCode}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{`${displayHostname}/r/${link.shortCode}`}</a>
                                        </TableCell>
                                        <TableCell>{(clickData[link.shortCode] || 0).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(link.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" title="Copy link" onClick={() => handleCopy(link.shortCode)}>
                                                    <CopyIcon className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Edit is a premium feature" onClick={() => alert('Edit functionality is a premium feature!')}>
                                                    <EditIcon className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Delete link" onClick={() => deleteLink(link.id)}>
                                                    <TrashIcon className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-semibold">No links yet!</h3>
                            <p className="text-muted-foreground mt-2">Create your first short link to see it here.</p>
                            <Button asChild className="mt-4">
                                <Link to="/">Create Link</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default DashboardPage;