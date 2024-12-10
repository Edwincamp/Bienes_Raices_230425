import { check, validationResult } from "express-validator"

import User from "../Models/Users.js"
import { generateId } from "../helpers/tokens.js"
import { registerEmail, passwordRecoveryEmail } from '../helpers/emails.js'

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
            errors: result.array(),
            user: {
                nombre: req.body.nombre,
                email: req.body.email,
                birthDate: req.body.birthDate,
            }
        })
    }

// ? Extraer datos
const { nombre, email, password, birthDate} = req.body

    // ? Verificar que el usuario no este duplicado
    const userExist = await User.findOne({ where: {email : email }})
    
    if(userExist) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'El usuario ya existe'}],
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
    res.render('templates/message', {
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

// Validar token para restablecimiento de contraseña
const checkToken = async (req, res) => {
    const { token } = req.params;
  
    const user = await User.findOne({ where: { token } });
  
    if (!user || !user.confirm) {
      return res.render("auth/confirmAccount", {
        page: "Restablece tu Contraseña...",
        msg: "Hubo un error al validar tu información. Verifica que tu cuenta esté confirmada.",
        error: true,
      });
    }
  
    // Formulario para modificar el password
    res.render("auth/reset-password", {
      page: "Restablece tu Contraseña",
      csrfToken: req.csrfToken(),
    });
  };
  const resetPassword = async (req, res) => {
    await check('email').notEmpty().withMessage('El correo electrónico es un campo obligatorio')
      .isEmail().withMessage('El correo electrónico no tiene el formato correcto')
      .run(req);
  
    const resultado = validationResult(req);
  
    if (!resultado.isEmpty()) {
      return res.render('auth/passwordRecovery', {
        page: 'Recupera tu acceso a Bienes Raíces',
        csrfToken: req.csrfToken(),
        errors: resultado.array(),
      });
    }
  
    const { email } = req.body;
  
    // Buscar el usuario
    const user = await User.findOne({ where: { email } });
  
    if (!user || !user.confirm) {
      return res.render('auth/passwordRecovery', {
        page: 'Recupera tu acceso a Bienes Raíces',
        csrfToken: req.csrfToken(),
        errors: [{ msg: 'El correo no pertenece a un usuario confirmado.' }],
      });
    }
  
    // Generar un token
    user.password="";
    user.token = generateId();
    await user.save();
  
    // Enviar un Email
    passwordRecoveryEmail({
      email: user.email,
      nombre: user.nombre,
      token: user.token,
    });
  
    // Mostrar mensaje de confirmación
    res.render('templates/message', {
      page: 'Restablece tu Contraseña',
      msg: `Hemos enviado un email a ${email} con las instrucciones para restablecer tu contraseña.`,
    });
  };
  
  // Restablecer contraseña
  const newPassword = async (req, res) => {
    // Validar el password
    await check("new_password")
      .notEmpty().withMessage("La contraseña es un campo obligatorio")
      .isLength({ min: 8 }).withMessage("El Password debe ser de al menos 8 caracteres")
      .run(req);
    await check("new_password2")
      .equals(req.body.new_password).withMessage("La contraseña debe coincidir con la anterior")
      .run(req);
  
    const resultado = validationResult(req);
  
    // Verificamos que el resultado esté vacío
    if (!resultado.isEmpty()) {
      return res.render("auth/reset-password", {
        page: "Reestablece tu Contraseña",
        csrfToken: req.csrfToken(),
        errors: resultado.array(),
      });
    }
    const { token } = req.params;
    const { new_password } = req.body;
  
    // Identificar quién hace el cambio
    const user = await User.findOne({ where: { token } });
  
    // Hashear el nuevo password
    user.password = new_password;
    user.token = null;
    await user.save();
  
    res.render("auth/confirmAccount", {
      page: "Password Reestablecido",
      msg: "El password se Guardó correctamente ",
    });
  };
  
  // Confirmar operación adicional
  const confirm = async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ where: { token } });
  
    if (!user) {
      return res.render("auth/confirmAccount", {
        page: "Error",
        msg: "Token inválido",
        error: true,
      });
    }
  
    res.render("templates/message", {
      page: "Operación Confirmada",
      msg: `Operación confirmada para el usuario ${user.name}.`,
    });
  };

export {
    formularioLogin,
    formularioRegister,
    formularioPasswordRecovery, 
    register, 
    confirmAccount,
    resetPassword,
    confirm,
    checkToken,
    newPassword,    
}