import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

const registerEmail = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS       
        }
    });

    const { email, nombre, token } = datos

    // ? Enviar el email

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu Cuenta en Bienes Raices',
        text: 'Confirma tu Cuenta en Bienes Raices',
        html: `
        <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Cuenta - Bienes Raíces</title>
        <style>
            /* Estilos globales */
            body {
                margin: 0;
                font-family: "Times New Roman", serif;
                background-color: #FFFFFF; /* Blanco */
                color: #000000; /* Negro */
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }

            /* Header */
            .header {
                display: flex;
                justify-content: space-around;
                background-color: #95B4D5; /* Azul claro */
                color: #FFFFFF; /* Texto blanco */
                text-align: center;
                padding: 1rem;
            }

            .header h1 {
                margin: 0;
                font-size: 2rem;
            }

            /* Main */
            .main {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 2rem;
            }

            .confirmation-box {
                background-color: #95B4D5; /* Azul claro */
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 500px;
                width: 100%;
            }

            .confirmation-box h2 {
                color: #000000; /* Negro */
                margin-bottom: 1rem;
                font-size: 1.8rem;
            }

            .confirmation-box p {
                color: #000000; /* Negro */
                margin-bottom: 1.5rem;
                font-size: 1rem;
                line-height: 1.5;
            }

            .confirm-button {
                display: inline-block;
                background-color: #F75555; /* Rojo */
                color: #FFFFFF; /* Texto blanco */
                text-decoration: none;
                padding: 0.75rem 1.5rem;
                border-radius: 5px;
                font-size: 1rem;
                font-weight: bold;
                transition: background-color 0.3s ease;
            }

            .confirm-button:hover {
                background-color: #93E16A; /* Verde (hover) */
            }

            .signature {
                margin-top: 2rem;
                text-align: left;
                color: #000000;
                font-size: 1rem;
            }

            .signature p {
                margin: 0.5rem 0;
            }

            .signature .name {
                font-weight: bold;
                font-size: 1.2rem;
            }

            /* Footer */
            .footer {
                background-color: #95B4D5; /* Azul claro */
                color: #FFFFFF; /* Texto blanco */
                text-align: center;
                padding: 1rem;
                font-size: 0.9rem;
            }

            .footer p {
                margin: 0;
            }
        </style>
    </head>
    <body>
        <header class="header">
            <h1>Bienes Raíces</h1>
            <img width="100" height="100" src="https://img.icons8.com/?size=100&id=TIW2jOmMayZS&format=png&color=000000" alt="real-estate"/>
        </header>
        <main class="main">
            <div class="confirmation-box">
                <h2>¡Bienvenido a Bienes Raíces!</h2>
                <p>¡Hola <strong>${nombre}</strong>!,  Gracias por unirte a nuestra comunidad. Nos complace ayudarte a encontrar la propiedad de tus sueños o el comprador ideal para tu inmueble.</p>
                <p>Al confirmar tu cuenta, tendrás acceso a las siguientes ventajas:</p>
                <ul style="text-align: left; padding-left: 20px; margin-bottom: 1.5rem;">
                    <li>Explorar cientos de propiedades exclusivas.</li>
                    <li>Guardar tus búsquedas y recibir notificaciones personalizadas.</li>
                    <li>Contactar directamente con agentes y vendedores.</li>
                    <li>Publicar tus propios inmuebles de forma sencilla y rápida.</li>
                </ul>
                <p>Para comenzar a disfrutar de estas ventajas, haz clic en el botón a continuación:</p>
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmAccount/${token}" 
                    style="background-color: #ee7956; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Confirmar Cuenta
                </a>
                <div class="signature">
                    <p>Saludos cordiales,</p>
                    <img src="https://xdddd.s3.us-east-2.amazonaws.com/firma.png" alt="firma" width="200px" height="200px">
                    <p class="name">Edwin Hernandez Campos</p>
                    <p>CEO, Bienes Raíces</p>
                </div>
            </div>
        </main>
        <footer class="footer">
            <p>&copy; 2024 Bienes Raíces. Todos los derechos reservados.</p>
        </footer>
    </body>
    </html>
            `
    })
}

export { registerEmail }