const controller = require('./controller');
const dateParse = require('../../utils/dateParse');

const fs = require('fs');

module.exports = {
    getImage: async (req, res, next) => {

        let uuid = req.params.uuid || null;

        if (!uuid) {
            return res.redirect('/redirect.html');
        }

        let options = {
                root: './cachefile',
                dotfiles: 'deny',
            },
            fileName = `${uuid}`;

        res.setHeader('Content-Type', 'image/png');
        
        res.sendFile(fileName, options);
    }
};