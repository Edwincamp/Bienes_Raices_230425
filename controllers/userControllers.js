const formularioLogin = (req, res) =>{
    res.render('auth/login',{
        page : "Iniciar sesion"
    })
};

const formularioRegister = (req, res) =>{
    res.render('auth/register',{
        page : "Crear una cuenta"
    })
};

const formularioPasswordRecovery = (req, res) =>{
    res.render('auth/passwordRecovery',{
        page : "Recupera tu contraseña"
    })
};

export {
    formularioLogin,
    formularioRegister,
    formularioPasswordRecovery
}