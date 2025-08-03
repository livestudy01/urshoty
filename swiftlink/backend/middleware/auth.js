const { Client, Users } = require('appwrite');

const authMiddleware = async (req, res, next) => {
    try {
        const sessionCookie = req.cookies[`a_session_${process.env.APPWRITE_PROJECT_ID}`];
        if (!sessionCookie) {
            return res.status(401).json({ message: 'Unauthorized: No session cookie provided.' });
        }
        
        // Create a user-specific client to verify the session against Appwrite's servers
        const userClient = new Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT)
            .setProject(process.env.APPWRITE_PROJECT_ID)
            .setSession(sessionCookie);

        const users = new Users(userClient);
        const user = await users.get('current'); // Throws an error if session is invalid
        
        // Attach user info to the request object for use in downstream controllers
        req.user = user;
        next();
    } catch (error) {
        // Appwrite's users.get() throws a 401 error for invalid sessions
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired session.' });
    }
};

module.exports = authMiddleware;
