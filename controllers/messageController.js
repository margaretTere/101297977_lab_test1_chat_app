const GroupMessage = require('../models/groupMessage');
const PrivateMessage = require('../models/privateMessage');


exports.getMessagesForRoom = async (req, res) => {
    const { room } = req.params; 

    try {
        const messages = await GroupMessage.find({ room })
            .sort({ date_sent: 1 }) 
            .exec();
        res.json(messages); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching group messages' });
    }
};

exports.getPrivateMessages = async (req, res) => {
    const { fromUser, toUser } = req.params;

    try {
        const messages = await PrivateMessage.find({
            $or: [
                { from_user: fromUser, to_user: toUser },
                { from_user: toUser, to_user: fromUser },
            ],
        })
            .sort({ date_sent: 1 }) 
            .exec();
        res.json(messages); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching private messages' });
    }
};

