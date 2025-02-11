const studentRegistrationMailTemplate = function (name, username, password) {
  return `<!DOCTYPE html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    .container {
      max-width: 600px;
      margin:auto;
      background-color: #ffffff;
    }

    body,
    table,
    td,
    p {
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      color: #333333;
      padding: 0;
    }

    a {
      text-decoration: none;
    }

    .logo {
      display: block;
      border: 0;
      outline: none;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 40px;
      margin-bottom: 40px;
    }

    .button {
      display: inline-block;
      margin: 20px auto;
      padding: 8px 16px;
      background-color: rgb(44, 2, 34);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 12px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div
    class="container"
  >
    <table
      class="email-container"
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
    >
      <tr>
        <td style="padding: 20px">
          <img
            class="logo"
            src="https://i.ibb.co/JRrGxpf3/images.jpg"
            alt="FV Logo"
            style="max-width: 75px; height: auto"
          />
          <hr
            style="border: none; border-top: 1px solid #dddddd; width: 100%"
          />
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; text-align: left">
          <p style="margin: 0"><b>Welcome to the CSICE Attenndace system!</b></p>
          <p style="margin: 0"><b>Dear ${name},</b></p>
          <p style="margin: 10px 0">
            Your login credentials:
          </p>
          <p style="margin: 10px 0">
            <strong>Username:</strong> ${username}
          </p>
          <p style="margin: 10px 0">
            <strong>Password:</strong> ${password}
          </p>
          <hr style="border: none; border-top: 1px solid #dddddd" />
        </td>
      </tr>
      <tr>
        <td
          align="center"
          style="padding: 20px; text-align: center; background-color: #f9f9f9"
        >
          <p style="margin: 5px 0; font-size: 14px; color: #777777">
            Team CSICE
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>`;
};

export default studentRegistrationMailTemplate;
