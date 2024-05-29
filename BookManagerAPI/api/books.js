module.exports = (req, res) => {
    if (req.method === 'GET') {
        res.status(200).json({ books: [] });
    } else if (req.method === 'POST') {
        res.status(201).json({ message: 'Book added' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};
