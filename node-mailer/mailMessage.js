const MailMessage = {
  getMessageBuffers: (to, sender, subject, message) => {
    const buffers = []; // Email as a buffer.
    buffers.push(new Buffer(`to: ${to}\n`));
    buffers.push(new Buffer(`from: ${sender}\n`));
    buffers.push(new Buffer(`subject: ${subject}\n\n`));
    buffers.push(new Buffer(`${message}`));
    return buffers;
  },
  // Gmail API needs the message to be encoded in base64 format so, 
  getEncodedMessage: (to, sender, subject, message) => {
    const buffers = MailMessage.getMessageBuffers(
      to, sender, subject, message, attachments);
    return Buffer.concat(buffers).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  },
};

module.exports = MailMessage;
