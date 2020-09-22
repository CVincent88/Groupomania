const passwordValidator = require('password-validator');

var schemaPassword = new passwordValidator();
schemaPassword
    .is().min(6)
    .is().max(15)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()

const emailRegex = /^[a-zA-Z0-9.\-]{2,20}@([a-zA-Z0-9]{2,15})+(\.[a-zA-Z]{2,3})+((\.[a-zA-Z]{2,3})?)+$/

function isValid(regex, stringToTest) {
    return regex.test(stringToTest);
}

module.exports = (req, res, next) => {
    if(isValid(emailRegex, req.body.emailAddress) && schemaPassword.validate(req.body.password)) {
        next();
    }else if(!isValid(emailRegex, req.body.emailAddress) && schemaPassword.validate(req.body.password)){
        res.status(400).json({ error: 'L\'adresse email ne respecte pas le format attendu' });
    }else if(isValid(emailRegex, req.body.emailAddress) && !schemaPassword.validate(req.body.password)){
        res.status(400).json({ error: 'Le mot de passe ne respecte pas le format attendu' });
    }else{
        res.status(400).json({ error: 'Ni l\'adresse email ou le mot de passe ne respectent le format attendu' });
    }
}
