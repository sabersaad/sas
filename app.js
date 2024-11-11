const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const bodyParser = require('body-parser');

const app = express();

// تفعيل body-parser لاستخراج البيانات من جسم الطلب
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new Client();
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR code received, scan it with your phone.');
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

client.initialize();

// تعريف مسار GET لإرسال الرسائل
app.get('/api/sendText/:phone', (req, res) => {
    const phone = req.params.phone;
    const text = req.query.text;

    if (!text) {
        return res.status(400).send('Text is required');
    }

    client.sendMessage(`${phone}@c.us`, text)
        .then(response => {
            res.send('Message sent successfully using GET!');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Failed to send message');
        });
});

// تعريف مسار POST لإرسال الرسائل
app.post('/api/sendText', (req, res) => {
    const phone = req.body.phone;
    const text = req.body.text;

    if (!phone || !text) {
        return res.status(400).send('Phone and text are required');
    }

    client.sendMessage(`${phone}@c.us`, text)
        .then(response => {
            res.send('Message sent successfully using POST!');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Failed to send message');
        });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
