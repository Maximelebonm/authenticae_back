const jwt = require('jsonwebtoken');

/* Creation et vérification des Token*/

const parseCookies = (cookieHeader) => {
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.split('=');
      cookies[name.trim()] = rest.join('=').trim();
    });
    return cookies;
  };

const jwtsecurity = (props) => {
    try {
        const {Id_user,email,roles,name,firstname,created_by,identifiant} =props
        const payload = {Id_user : Id_user, email : email, firstname : firstname,role : roles, created_by : created_by, identifiant : identifiant};
        return jwt.sign(payload, process.env.JWT_SECRET)
        
    } catch (error) {
        return error
    }
}

const jwtCart = (props) => {
    const Id_cart = props
    const payload = {Id_cart : Id_cart};
    return jwt.sign(payload, process.env.JWT_SECRET)
}

const jwtsecurityValidEmail = (props) => {
    const {Id_user,email,roles,firstname,lastname,birthdate,phone,password,created_by,identifiant} =props
    const payload = {
        Id_user : Id_user,
        email : email, 
        role : roles,
        firstname : firstname,
        lastname : lastname,
        birthdate : birthdate,
        phone : phone,
        password : password,
        created_by : created_by,
        identifiant : identifiant
    };
    return jwt.sign(payload, process.env.JWT_SECRET)
}


const decodeToken = (token)=> {
    const decode = jwt.decode(token,process.env.JWT_SECRET)
    return decode
}


/* création et vérification des mots de passe */
const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (password)=> {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        throw error;
    }
}

const comparePassword = async (passwordToCheck,hashedPasswordFromDatabase)=>{
    try{
        const PasswordChecked = await bcrypt.compare(passwordToCheck, hashedPasswordFromDatabase);
        return PasswordChecked;
    }
    catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        throw error;
    }
}



module.exports = {parseCookies,jwtsecurity,jwtCart,decodeToken,comparePassword,hashPassword,jwtsecurityValidEmail}