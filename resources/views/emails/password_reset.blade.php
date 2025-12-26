<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Kode Verifikasi</title>
</head>

<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:Arial,Helvetica,sans-serif;color:#0F172A;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Kode verifikasi login / reset password (berlaku 5 menit).
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#F1F5F9;padding:32px 0;">
    <tr>
      <td align="center" style="padding:0 16px;">

        <table role="presentation" width="420" cellpadding="0" cellspacing="0" border="0"
               style="max-width:420px;width:100%;background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:8px;overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="padding:16px 20px;border-bottom:1px solid #E2E8F0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="width:48px;padding-right:10px;">
                    <img
                      src="{{ $message->embed(public_path('image/logo.png')) }}"
                      alt="KAI"
                      width="40"
                      style="display:block;border:0;outline:none;text-decoration:none;">
                  </td>
                  <td valign="middle">
                    <div style="font-size:13px;font-weight:700;color:#1F3C88;">
                      KAI Device Management
                    </div>
                    <div style="font-size:12px;color:#475569;">
                      Pemberitahuan Sistem
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:20px;">
              <div style="font-size:14px;line-height:1.6;">

                <p style="margin:0 0 10px;">
                  Yth. <strong>{{ $user->name ?? 'Pegawai' }}</strong>,
                </p>

                <p style="margin:0 0 12px;">
                  Berikut adalah kode verifikasi untuk melanjutkan proses autentikasi akun Anda.
                </p>

                <p style="margin:0 0 10px;color:#475569;">
                  Kode berlaku selama <strong style="color:#0F172A;">5 menit</strong>.
                </p>

                <!-- OTP -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                       style="margin:16px 0 18px;">
                  <tr>
                    <td align="center"
                        style="padding:14px;border:1px dashed #1F3C88;border-radius:8px;">
                      <div style="font-size:24px;font-weight:700;letter-spacing:6px;color:#1F3C88;">
                        {{ $code }}
                      </div>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 10px;color:#475569;">
                  Jangan membagikan kode ini kepada siapa pun.
                </p>

                <p style="margin:0;">
                  Hormat kami,<br>
                  <strong>Unit Sistem Informasi KAI DAOP 6</strong>
                </p>

              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:12px 20px;border-top:1px solid #E2E8F0;background-color:#F8FAFC;">
              <div style="font-size:12px;line-height:1.5;color:#64748B;text-align:center;">
                Email ini dikirim otomatis oleh sistem internal. Mohon tidak membalas email ini.
              </div>
            </td>
          </tr>

        </table>

        <div style="font-size:12px;color:#94A3B8;margin-top:10px;text-align:center;">
          © {{ date('Y') }} PT Kereta Api Indonesia (Persero) – DAOP 6
        </div>

      </td>
    </tr>
  </table>

</body>
</html>
