const nodemailer = require("nodemailer");
const mailerConfig = require('../configs/mailer.config')
const appConfig = require('../configs/app.config')

const transporter = nodemailer.createTransport({
  host: mailerConfig.host,
  port: mailerConfig.port,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: mailerConfig.auth.user,
    pass: mailerConfig.auth.pass,
  },
});

// async..await is not allowed in global scope, must use a wrapper
const mailvalidation = async (req,token)=> {
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: '"Authenticae" <contact@authenticae.fr>', // sender address
      to: req.body.email, // list of receivers
      subject: "Authenticae - Valider votre email", // Subject line
      html: `
          <style>
            .mailContainer{
              padding : 40px;
              background-color : #dfccb3;
              height : 100%;
            }
            .mailContent{
              padding : 20px;
              background-color : #ffffff;
              border-radius : 15px;
            }
            p {
              font-size: 16px;
            }
            .header {
              background-color: #f0f0f0;
              padding: 10px;
            }
            .barreTop {
              border-top : 1px solid;
            margin-top : 80px;
            }
            footer {
            margin-top : 10px;
            }
        </style>
                 <div class='mailContainer'>
          <div class='mailContent'>
            <div>
              <p>Afin de valider votre email, veuillez cliquer sur le bouton ci-dessous :</p>
              <a href="${appConfig.origin}/validation/${token} " style="display: inline-block; padding: 10px 20px; background-color: #86735B; color: #fff; text-decoration: none; border-radius: 5px;">Valider mon email</a>
            <div class="barreTop"><div>
              <footer>
                contact email : contact@authenticae.fr
              </footer>
          </div>
        </div>
  
    `,
    });
    return info
  } catch (error) {
    return error
  }

  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
const mailProduction = async(req)=>{
  try {
    const info = await transporter.sendMail({
      from: '"Authenticae" <harry.olson64@ethereal.email>', // sender address
      to: req.body.email, // list of receivers
      subject: "Authenticae - Produit pris en charge", // Subject line
      html: `
        <style>
          .mailContainer{
            padding : 40px;
            background-color : #dfccb3;
            height : 100%;
          }
          .mailContent{
            padding : 20px;
            background-color : #ffffff;
            border-radius : 15px;
          }
          p {
            font-size: 16px;
          }
          .header {
            background-color: #f0f0f0;
            padding: 10px;
          }
          .barreTop {
            border-top : 1px solid;
          margin-top : 80px;
          }
          footer {
          margin-top : 10px;
          }
      </style>
         <div class='mailContainer'>
        <div class='mailContent'>
          <div>
        Cet email est un email automatique, veuillez ne pas répondre
        <p>Bonjour ${req.body.firstname}, </p>
          <p>Votre produit ${req.body.productname} à été pris en charge</p>

          <p>Cordialement,</p>

          <p>Authenticae.</p>
          </div>
          <div class="barreTop"><div>
            <footer>
              contact email : contact@authenticae.fr
            </footer>
        </div>
      </div>
    `,
    });
    return info

  } catch (error) {
    return error
  }
}
const cancelmailProduction = async(req)=>{
  try {
    const info = await transporter.sendMail({
      from: '"Authenticae" <harry.olson64@ethereal.email>', // sender address
      to: req.body.email, // list of receivers
      subject: "Authenticae - annulation prise en charge", // Subject line
      html: `
           <style>
          .mailContainer{
            padding : 40px;
            background-color : #dfccb3;
            height : 100%;
          }
          .mailContent{
            padding : 20px;
            background-color : #ffffff;
            border-radius : 15px;
          }
          p {
            font-size: 16px;
          }
          .header {
            background-color: #f0f0f0;
            padding: 10px;
          }
          .barreTop {
            border-top : 1px solid;
          margin-top : 80px;
          }
          footer {
          margin-top : 10px;
          }
      </style>
      <div class='mailContainer'>
        <div class='mailContent'>
          <div>
          Cet email est un email automatique, veuillez ne pas répondre
          <p>Bonjour ${req.body.firstname}, </p>
          <p>Suite à une erreur de notre part, votre produit ${req.body.productname} n'a pas été pris en charge par notre collaborateur, vous recevrez un nouvel email une fois que votre objet sera en cours de fabrication</p>
          
          <p>Cordialement,</p>
          
          <p>Authenticae.</p>
          </div>
          <div class="barreTop"><div>
        <footer>
          contact email : contact@authenticae.fr
        </footer>
        </div>
      </div>
    `,
    });
    return info
    
  } catch (error) {
    return error
  }
}
const mailsendProduct = async(req)=>{
  try {
    const info = await transporter.sendMail({
      from: '"Authenticae" <harry.olson64@ethereal.email>', // sender address
      to: req.body.email, // list of receivers
      subject: "Authenticae - Produit envoyé", // Subject line
      html: `
      <style>
          .mailContainer{
            padding : 40px;
            background-color : #dfccb3;
            height : 100%;
          }
          .mailContent{
            padding : 20px;
            background-color : #ffffff;
            border-radius : 15px;
          }
          p {
            font-size: 16px;
          }
          .header {
            background-color: #f0f0f0;
            padding: 10px;
          }
          .barreTop {
            border-top : 1px solid;
          margin-top : 80px;
          }
          footer {
          margin-top : 10px;
          }
      </style>
      <div class='mailContainer'>
        <div class='mailContent'>
          <div>
            Cet email est un email automatique, veuillez ne pas répondre
            <p> Bonjour ${req.body.firstname}, </p>
          <p>votre produit ${req.body.productname} à été envoyé ! Merci pour la confiance que vous nous avez accordé n'hésitez pas à nous donner votre retour sur nos différents réseaux !</p>
          
          <p>Cordialement,</p>

          <p>Authenticae.</p>
          </div>
          <div class="barreTop"><div>
        <footer>
          contact email : contact@authenticae.fr
        </footer>
          
        </div>
      </div>
    `,
    });
    return info
    
  } catch (error) {
    return error
  }
}
const mailPaiement = async(req)=>{
  try {
    const info = await transporter.sendMail({
      from: '"Authenticae" <harry.olson64@ethereal.email>', // sender address
      to: req.body.user.email, // list of receivers
      subject: "Authenticae - Paiement confirmé", // Subject line
      html: `
      <style>
          .mailContainer{
            padding : 40px;
            background-color : #dfccb3;
            height : 100%;
          }
          .mailContent{
            padding : 20px;
            background-color : #ffffff;
            border-radius : 15px;
          }
          p {
            font-size: 16px;
          }
          .header {
            background-color: #f0f0f0;
            padding: 10px;
          }
          .barreTop {
            border-top : 1px solid;
          margin-top : 80px;
          }
          footer {
          margin-top : 10px;
          }
      </style>
      <div class='mailContainer'>
        <div class='mailContent'>
          <div>
            Cet email est un email automatique, veuillez ne pas répondre
            <p> Bonjour ${req.body.user.firstname}, </p>
          <p>votre paiement pour votre commande à été accepté ! Merci pour la confiance que vous nous accordé ! Vous serez tenus informé lors des différentes étapes pour vos produits.</p>

          <p>Cordialement,</p>

          <p>Authenticae.</p>
          </div>
          <div class="barreTop"><div>
        <footer>
          contact email : contact@authenticae.fr
        </footer>
          
        </div>
      </div>
    `,
    });
    return info
    
  } catch (error) {
    return error
  }
}
const mailCancelpercent =async(req,finalAmout)=>{
  try { 
  const info = await transporter.sendMail({
    from: '"Authenticae" <harry.olson64@ethereal.email>', // sender address
    to: req.body.user.email, // list of receivers
    subject: "Authenticae - annulation confirmé", // Subject line
    html: `
    <style>
        .mailContainer{
          padding : 40px;
          background-color : #dfccb3;
          height : 100%;
        }
        .mailContent{
          padding : 20px;
          background-color : #ffffff;
          border-radius : 15px;
        }
        p {
          font-size: 16px;
        }
        .header {
          background-color: #f0f0f0;
          padding: 10px;
        }
        .barreTop {
          border-top : 1px solid;
        margin-top : 80px;
        }
        footer {
        margin-top : 10px;
        }
    </style>
    <div class='mailContainer'>
      <div class='mailContent'>
        <div>
          Cet email est un email automatique, veuillez ne pas répondre
          <p> Bonjour ${req.body.user.firstname}, </p>
        <p>Nous confirmons l'annulation de votre produit. Celui ci étant en cours de fabrication, il était avancer de ${req.body.percent}, vous ne serez rembourser donc que de ${finalAmout}€ </p>

        <p>Cordialement,</p>

        <p>Authenticae.</p>
        </div>
        <div class="barreTop"><div>
      <footer>
        contact email : contact@authenticae.fr
      </footer>
        
      </div>
    </div>
  `,
  });
  return info
  
} catch (error) {
  return error
}
}
const mailCancelByUser = async(req)=>{
  try {
    const info = await transporter.sendMail({
      from: '"Authenticae" <harry.olson64@ethereal.email>', // sender address
      to: req.body.user.email, // list of receivers
      subject: "Authenticae - annulation confirmé", // Subject line
      html: `
      <style>
          .mailContainer{
            padding : 40px;
            background-color : #dfccb3;
            height : 100%;
          }
          .mailContent{
            padding : 20px;
            background-color : #ffffff;
            border-radius : 15px;
          }
          p {
            font-size: 16px;
          }
          .header {
            background-color: #f0f0f0;
            padding: 10px;
          }
          .barreTop {
            border-top : 1px solid;
          margin-top : 80px;
          }
          footer {
          margin-top : 10px;
          }
      </style>
      <div class='mailContainer'>
        <div class='mailContent'>
          <div>
            Cet email est un email automatique, veuillez ne pas répondre
            <p> Bonjour ${req.body.user.firstname}, </p>
          <p>Nous confirmons l'annulation de votre produit .</p>

          <p>Cordialement,</p>

          <p>Authenticae.</p>
          </div>
          <div class="barreTop"><div>
        <footer>
          contact email : contact@authenticae.fr
        </footer>
          
        </div>
      </div>
    `,
    });
    return info
    
  } catch (error) {
    return error
  }
}
const cancelmailsendProduct = async(req)=>{
  try {
    const info = await transporter.sendMail({
      from: '"Authenticae" <harry.olson64@ethereal.email>', // sender address
      to: req.body.email, // list of receivers
      subject: "annulation envoie", // Subject line
      html: `
 <style>
        .mailContainer{
          padding : 40px;
          background-color : #dfccb3;
          height : 100%;
        }
        .mailContent{
          padding : 20px;
          background-color : #ffffff;
          border-radius : 15px;
        }
        p {
          font-size: 16px;
        }
        .header {
          background-color: #f0f0f0;
          padding: 10px;
        }
        .barreTop {
          border-top : 1px solid;
        margin-top : 80px;
        }
        footer {
        margin-top : 10px;
        }
    </style>
          <div class='mailContainer'>
        <div class='mailContent'>
          <div>
            Cet email est un email automatique, veuillez ne pas répondre
            <p> Bonjour ${req.body.user.firstname}, </p>
           <p>Suite à une erreur de notre part, votre produit n'a pas réelement été envoyé par notre collaborateur, vous recevrez un nouvel email une fois que votre objet sera envoyé</p>

          <p>Cordialement,</p>

          <p>Authenticae.</p>
          </div>
          <div class="barreTop"><div>
        <footer>
          contact email : contact@authenticae.fr
        </footer>
          
        </div>
      </div>
    `,
    });
    return info
    
  } catch (error) {
    return error
  }
}
const mailcancelOrder = async(req)=>{
  try {
    const info = await transporter.sendMail({
      from: '"Authenticae" <harry.olson64@ethereal.email>', // sender address
      to: req.body.user.email, // list of receivers
      subject: "Authenticae - annulation commande", // Subject line
      html: `
  <style>
        .mailContainer{
          padding : 40px;
          background-color : #dfccb3;
          height : 100%;
        }
        .mailContent{
          padding : 20px;
          background-color : #ffffff;
          border-radius : 15px;
        }
        p {
          font-size: 16px;
        }
        .header {
          background-color: #f0f0f0;
          padding: 10px;
        }
        .barreTop {
          border-top : 1px solid;
        margin-top : 80px;
        }
        footer {
        margin-top : 10px;
        }
    </style>
     <div class='mailContainer'>
        <div class='mailContent'>
          <div>
            Cet email est un email automatique, veuillez ne pas répondre
            <p> Bonjour ${req.body.user.firstname}, </p>
           <p>Suite à une erreur de notre part, votre produit n'a pas réelement été envoyé par notre collaborateur, vous recevrez un nouvel email une fois que votre objet sera envoyé</p>

          <p>Cordialement,</p>

          <p>Authenticae.</p>
          </div>
          <div class="barreTop"><div>
        <footer>
          contact email : contact@authenticae.fr
        </footer>
          
        </div>
      </div>
    `,
    });
    return info
    
  } catch (error) {
    return error
  }
}
module.exports = {
  mailvalidation,
  mailProduction,
  cancelmailsendProduct,
  mailsendProduct,
  cancelmailProduction,
  mailPaiement,
  mailCancelByUser,
  mailCancelpercent,
  mailcancelOrder
}

