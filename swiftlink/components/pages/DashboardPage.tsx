
import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
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
    const { user, links, deleteLink, isLoading, fetchLinks } = useAuth();
    const [clickData, setClickData] = useState<Record<string, number>>({});
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        // Fetch initial data if not already loaded
        if(user && links.length === 0) {
            fetchLinks();
        }
        // In a real app, you might fetch click data from your backend here
        // For this demo, we'll assume clicks are not displayed in real-time on the dashboard
    }, [user, fetchLinks, links.length]);
    
    const totalClicks = useMemo(() => Object.values(clickData).reduce((acc, clicks) => acc + clicks, 0), [clickData]);

    const handleCopy = (shortCode: string) => {
        navigator.clipboard.writeText(`${backendUrl}/r/${shortCode}`);
    };
    
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p>Loading your dashboard...</p>
            </div>
        )
    }

    if (!user) {
        // This should ideally not be reached if routes are protected, but as a fallback:
        navigate('/login');
        return null;
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
                    <CardTitle>Your Links</CardTitle>
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
                                            <a href={`${backendUrl}/r/${link.shortCode}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{`swift.ly/${link.shortCode}`}</a>
                                        </TableCell>
                                        <TableCell>{(clickData[link.shortCode] || 0).toLocaleString()}</TableCell>
                                        <TableCell>{new Date(link.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" title="Copy link" onClick={() => handleCopy(link.shortCode)}>
                                                    <CopyIcon className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="Edit functionality is a premium feature!" onClick={() => alert('Edit functionality is a premium feature!')}>
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
