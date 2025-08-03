const express = require('express');
const { Databases, Query } = require('appwrite');
const { appwriteAdminClient, mysqlPool } = require('../services');

const router = express.Router();
const dbAdmin = new Databases(appwriteAdminClient);

// URL Redirector
router.get('/r/:shortCode', async (req, res) => {
    const { shortCode } = req.params;
    if (!shortCode) {
        return res.status(400).send('Short code is missing.');
    }
    
    try {
        const response = await dbAdmin.listDocuments(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_LINKS_COLLECTION_ID,
            [Query.equal('shortCode', shortCode), Query.limit(1)]
        );

        if (response.documents.length === 0) {
            return res.status(404).send('Link not found.');
        }
        const link = response.documents[0];

        // Increment click count in MySQL. Fire-and-forget to not slow down the redirect.
        mysqlPool.execute(
            'INSERT INTO link_clicks (short_code, clicks) VALUES (?, 1) ON DUPLICATE KEY UPDATE clicks = clicks + 1',
            [shortCode]
        ).catch(err => console.error("MySQL click increment failed:", err));

        res.redirect(301, link.longUrl);
    } catch (error) {
        console.error('Redirect error:', error);
        res.status(500).send('An error occurred while processing your link.');
    }
});

module.exports = router;
