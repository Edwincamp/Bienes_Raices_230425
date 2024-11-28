import { check, validationResult } from "express-validator"

import User from "../Models/Users.js"
import { generateId } from "../helpers/tokens.js"
import { registerEmail } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        page : 'Inicia Sesion'
    })
}

const formularioRegister = (req, res) => {
    res.render('auth/register', {
        page: 'Crear Cuenta',
        csrfToken: req.csrfToken(),
    })
}

const register = async (req, res) => { 

    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio X').run(req)
    await check('email').isEmail().withMessage('El correo no puede ir vacio X').run(req)
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe ser de al menos 8 caracteres X').run(req)
    await check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden X').run(req)

    await check('birthDate').isISO8601().withMessage('La fecha de nacimiento debe ser válida X').bail().custom((value) => {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Ajustar la edad si aún no ha pasado el cumpleaños este año
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            return age - 1 >= 18;
        }
        return age >= 18;
    })
    .withMessage('Debe ser mayor de edad para registrarse. X')
    .run(req);

    let result = validationResult(req)

    // ? Verificar que el resultado este vacio
    if(!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: result.array(),
            user: {
                nombre: req.body.nombre,
                email: req.body.email,
                birthDate: req.body.birthDate,
            }
        })
    }

        await transport.sendPail({
            from: 'bienesraices_230425.com',
            to: email,
            subject: 'solicitud de actualizacion de contraseña en BienesRaices.com',
            text: 'Por favor actualiza tu contraseña para ingresar a ola plataforma',
            html: <p>Hola, <span style="color: red"> ${name}</span>, <br>
            Haz reportado el olvido perdida de tu contrasseña para acceder a tu cuenta de BienesRaices...
            </br>
            <p> Por lo que necesitamos que ingreses a la siguiente liga para: 
            <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/changePassword/${token}">Actualizar Contraseña</a> 
            </p> </p>
            
        })

// ? Extraer datos
const { nombre, email, password, birthDate} = req.body

    // ? Verificar que el usuario no este duplicado
    const userExist = await User.findOne({ where: {email : email }})
    
    if(userExist) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya existe'}],
            user: {
                nombre: req.body.nombre,
                email: req.body.email,
                birthDate: req.body.birthDate,
            }
        })
    }

    // ? Almacenar un usuario
    const user = await User.create({
        nombre,
        email,
        password,
        birthDate,
        token: generateId()
    })

    // ? Envia email de confirmacion
    registerEmail({
        nombre: user.nombre,
        email: user.email,
        token: user.token
    })



    // ? Mostrar mensaje de confirmacion
    res.render('templates/mesage', {
        page: 'Cuenta Creada Correctamente', 
        mesage: `Se ha enviado un email de confirmación a: ${req.body.email}, por favor, ingrese al siguiente enlace`
    })
}

// ? Funcion que comprueba una cuenta
const confirmAccount = async (req, res) => {

    const { token } = req.params

    // ? Verificar si el token es valido
    const confirmUser = await User.findOne({ where : {token}})
    
    if(!confirmUser) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu Cuenta',
            mesage: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true,
        })
    }

    // ? Confirmar la cuenta
    confirmUser.token = null
    confirmUser.confirm = 1
    await confirmUser.save()

    res.render('auth/confirmAccount', {
        page: 'Cuenta Confirmada',
        mesage: 'La cuenta se confirmo correctamente',
    })

}
     

const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        page : 'Recupera tu contraseña',
        csrfToken: req.csrfToken()
    })
}

export {
    formularioLogin, formularioRegister, register, confirmAccount, formularioPasswordRecovery
}

    if (extingUser)
    {
            return response.render("auth/passwordRecovery"),{
                page: 'Error, no existe una cuenta asociada al coprreo electronico ingresado.'
                csrfToken: req.csrfToken(),
                errores: [(msg: 'El email no existe')],
                

            }
    }