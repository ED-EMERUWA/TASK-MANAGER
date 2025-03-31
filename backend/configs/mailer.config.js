import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ed.emeruwa@itas.ca',
    pass: '667253710'
  }
});

export default function tryMail (){
var mailOptions = {
  from: 'ed.emeruwa@itas.ca',
  to: 'webdevKene@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}