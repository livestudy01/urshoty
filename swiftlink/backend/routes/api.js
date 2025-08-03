const express = require('express');
const { Databases, Query, ID } = require('appwrite');
const { appwriteAdminClient, mysqlPool, razorpay } = require('../services');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const dbAdmin = new Databases(appwriteAdminClient);

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

// --- LINK MANAGEMENT ---

// Get all links for the authenticated user
router.get('/links', async (req, res) => {
    try {
        const response = await dbAdmin.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_LINKS_COLLECTION_ID,
            [Query.equal('userId', req.user.$id), Query.orderDesc('$createdAt')]
        );
        
        // Re-format to match frontend's LinkItem type
        const links = response.documents.map(doc => ({
            id: doc.$id,
            longUrl: doc.longUrl,
            shortCode: doc.shortCode,
            createdAt: doc.createdAt,
            clicks: 0, // Clicks are fetched separately
        }));
        
        res.json(links);
    } catch (error) {
        console.error("Failed to fetch links:", error);
        res.status(500).json({ message: 'Failed to fetch links' });
    }
});

// Create a new link
router.post('/links', async (req, res) => {
    const { longUrl, customSlug } = req.body;
    
    // Basic Validation
    if (!longUrl || typeof longUrl !== 'string') {
        return res.status(400).json({ message: 'A valid longUrl string is required' });
    }
    try {
        new URL(longUrl); // Check if it's a valid URL format
    } catch (_) {
        return res.status(400).json({ message: 'The provided URL is not valid.' });
    }

    const shortCode = customSlug || Math.random().toString(36).substring(2, 8);

    try {
        // Check if custom alias already exists
        if (customSlug) {
            const existing = await dbAdmin.listDocuments(
                process.env.APPWRITE_DATABASE_ID,
                process.env.APPWRITE_LINKS_COLLECTION_ID,
                [Query.equal('shortCode', shortCode), Query.limit(1)]
            );
            if (existing.documents.length > 0) {
                return res.status(409).json({ message: 'This custom alias is already taken.' });
            }
        }
        
        const createdAt = new Date().toISOString();
        const newDocument = await dbAdmin.createDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_LINKS_COLLECTION_ID,
            ID.unique(),
            { longUrl, shortCode, userId: req.user.$id, createdAt }
        );
        
        await mysqlPool.execute('INSERT INTO link_clicks (short_code, clicks) VALUES (?, 0) ON DUPLICATE KEY UPDATE short_code=short_code', [shortCode]);
        
        res.status(201).json({
            id: newDocument.$id,
            longUrl: newDocument.longUrl,
            shortCode: newDocument.shortCode,
            createdAt: newDocument.createdAt,
            clicks: 0,
        });

    } catch (error) {
        console.error("Failed to create link:", error);
        res.status(500).json({ message: 'Failed to create link' });
    }
});

// Delete a link
router.delete('/links/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const doc = await dbAdmin.getDocument(process.env.APPWRITE_DATABASE_ID, process.env.APPWRITE_LINKS_COLLECTION_ID, id);

        if (doc.userId !== req.user.$id) {
            return res.status(403).json({ message: 'Forbidden: You do not own this link' });
        }
        
        await dbAdmin.deleteDocument(process.env.APPWRITE_DATABASE_ID, process.env.APPWRITE_LINKS_COLLECTION_ID, id);
        await mysqlPool.execute('DELETE FROM link_clicks WHERE short_code = ?', [doc.shortCode]);

        res.status(204).send();
    } catch (error) {
        console.error("Failed to delete link:", error);
        res.status(500).json({ message: 'Failed to delete link' });
    }
});

// --- ANALYTICS ---

// Get click counts for user's links
router.get('/clicks', async (req, res) => {
    try {
        const linksResponse = await dbAdmin.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_LINKS_COLLECTION_ID,
            [Query.equal('userId', req.user.$id), Query.select(['shortCode'])]
        );
        
        const shortCodes = linksResponse.documents.map(d => d.shortCode);
        if (shortCodes.length === 0) {
            return res.json({});
        }

        const [rows] = await mysqlPool.query('SELECT short_code, clicks FROM link_clicks WHERE short_code IN (?)', [shortCodes]);

        const clickData = rows.reduce((acc, row) => {
            acc[row.short_code] = row.clicks;
            return acc;
        }, {});
        
        res.json(clickData);
    } catch (error) {
        console.error("Failed to fetch click data:", error);
        res.status(500).json({ message: 'Failed to fetch click data' });
    }
});

// --- PAYMENTS ---

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
    const { amount } = req.body;
    
    // Basic validation
    if (!amount || typeof amount !== 'number' || amount < 100) {
        return res.status(400).json({ error: 'A valid amount is required.' });
    }
    
    const options = {
        amount, // Amount is in paise
        currency: "INR",
        receipt: `receipt_order_${req.user.$id}_${new Date().getTime()}`,
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error("Razorpay order creation failed:", error);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
});

module.exports = router;
