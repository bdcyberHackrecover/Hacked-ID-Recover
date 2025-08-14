// api/submit.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'শুধুমাত্র POST অনুরোধ গ্রহণযোগ্য' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  // Gmail ব্যবহার করে মেইল পাঠানো
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'আপনার_ইমেইল@gmail.com', // আপনার ইমেইল
      pass: 'আপনার_অ্যাপ_পাসওয়ার্ড', // Google App Password (2FA চালু করে তৈরি করুন)
    },
  });

  const mailOptions = {
    from: 'আপনার_ইমেইল@gmail.com',
    to: 'আপনার_ইমেইল@gmail.com', // আপনার কাছে মেইল যাবে
    subject: `🔔 নতুন রিকভারি আবেদন: ${body.full_name}`,
    text: `
      নতুন হ্যাকড অ্যাকাউন্ট রিকভারি আবেদন পাওয়া গেছে:

      নাম: ${body.full_name}
      যোগাযোগ: ${body.phone}
      বিকল্প ইমেইল: ${body.alt_email}
      অ্যাকাউন্ট: ${body.account_id}
      প্ল্যাটফর্ম: ${body.platform}
      হ্যাকের তারিখ: ${body.hack_date}
      প্রমাণ: ${body.evidence}
      সম্মতি: ${body.esig} (${body.sig_date})

      সম্পূর্ণ ডেটা: ${JSON.stringify(body, null, 2)}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'মেইল সফল' });
  } catch (error) {
    console.error('মেইল ত্রুটি:', error);
    return res.status(500).json({ error: 'মেইল পাঠাতে ব্যর্থ' });
  }
};
