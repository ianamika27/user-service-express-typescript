import nodemailer from 'nodemailer';
import pug  from 'pug';

class EmailService {
    to = ''
    firstName = ''
    url = ''
    from = ''

    constructor(user,url){
        this.to = 'anamikait27@gmail.com';
        this.firstName = user.fullname.split(' ')[0];
        this.url = url;
        this.from = `Anamika <${process.env.EMAIL_FROM}>`;
    }
    newTransport(){
        
        //sendgrid
        return nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.SENDGRID_USERNAME,
                pass:process.env.SENDGRID_PASSWORD
            }
        });
    }

    async send(template,subject){
        // 1) Render Html template on a pug template
        const html = pug.renderFile(`./src/templates/emails/${template}.pug`,
        {
            firstName:this.firstName,
            url:this.url,
            subject
        });

        // 2) Define email options
        const mailOptions = {
            from:this.from,
            to:this.to,
            subject:subject,
            html:html,
            // text:htmlToText.convert(html)
        }
        // 3) create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    };

    async sendWelcome(){
        await this.send('_welcome','Welcome to the natours family');
    }

    async sendPasswordReset(){
        await this.send('_passwordreset','Your password reset token (valid) for only 10min');
    }
}

export default EmailService;