'use strict';

import nodemailer from 'nodemailer';

import {
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_USER,
  FRONTEND_URL,
} from './../config';

export const emailRegister = async emailData => {
  const { name, email, token } = emailData;

  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  // Send mail with defined transport object
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos 👻" <hola@uptask.com>',
    to: email,
    subject: 'UpTask - Confirma tu cuenta ✔',
    text: 'Comprueba tu cuenta en UpTask',
    html: `<p>Hola ${name}, comprueba tu cuenta en UpTask</p>
    <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:
      <a href="${FRONTEND_URL}/confirm-account/${token}">Comrpobar cuenta</a>
    </p>

    <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
  `,
  });
};
