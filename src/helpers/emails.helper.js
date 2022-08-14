'use strict';

import nodemailer from 'nodemailer';

import {
  EMAIL_HOST,
  EMAIL_PASS,
  EMAIL_PORT,
  EMAIL_USER,
  FRONTEND_URL,
} from './../config';

const setTransport = () =>
  nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

export const emailRegister = async emailData => {
  const { name, email, token } = emailData;

  const transport = setTransport();

  // Send mail with defined transport object
  await transport.sendMail({
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

  console.log(`${FRONTEND_URL}/confirm-account/${token}`);
};

export const emailResetPassword = async emailData => {
  const { name, email, token } = emailData;
  console.log('email:', { name, email, token });

  const transport = setTransport();

  // Send mail
  await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos 👻" <hola@uptask.com>',
    to: email,
    subject: 'UpTask - Reestablece tu Password',
    text: 'Reestablece tu Password',
    html: `<p>Hola ${name}, has solicitado restablecer tu password.</p>

      <p>Sigue el siguiente enlace para generar tu nuevo password:
        <a href="${FRONTEND_URL}/forgot-password/${token}">Restablecer Password</a>
      </p>

      <p>Si tu no solicitaste esto, puedes ignorar este mensaje.</p>
    `,
  });
};
