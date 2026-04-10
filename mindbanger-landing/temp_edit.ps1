$content = Get-Content src/app/api/auth/magic-link/route.ts -Raw
$newHtml = @"
    const htmlContent = \`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: -apple-system, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .card { background-color: rgba(30, 41, 59, 1); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 40px; text-align: center; }
        .title { font-family: Georgia, serif; font-size: 24px; margin-bottom: 16px; color: #f8fafc; }
        .text { color: #94a3b8; line-height: 1.6; margin-bottom: 24px; font-size: 16px; }
        .code-box { background-color: #0f172a; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; margin: 24px 0; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #fde68a; }
        .button { display: inline-block; background: linear-gradient(to right, #fde68a, #f59e0b, #d97706); color: #0f172a !important; font-weight: bold; text-decoration: none; padding: 16px 36px; border-radius: 9999px; box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.4); font-size: 16px; margin-top: 10px; }
        .footer { text-align: center; margin-top: 40px; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body style="background-color:#0f172a;">
      <div class="container">
        <div class="header" style="text-align: center; margin-bottom: 40px;">
          <span class="logo" style="font-family: Georgia, serif; font-size: 24px; font-weight: bold; color: #f8fafc;">Mindbanger Daily</span>
        </div>

        <div class="card">
          <h1 class="title">Tvoj overovacÌ kÛd</h1>
          <p class="text">
            SkopÌruj si alebo si zapam‰taj tento 6-miestny kÛd:
          </p>

          <div class="code-box">
            \${otpCode}
          </div>

          <p class="text" style="font-size: 14px;">
            Ak si sa sem dostal z inej aplik·cie, stlaË tlaËidlo niûöie, ktorÈ ùa bezpeËne prepne sp‰ù do prehliadaËa priamo na zadanie kÛdu.
          </p>
          
          <a href="https://mindbanger.com/login?step=otp&email=\${encodeURIComponent(email)}" class="button">
            Prejsù na zadanie kÛdu
          </a>
        </div>
        
        <div class="footer">
          &copy; 2026 Mindbanger Daily<br/>
          Tento email bol vygenerovan˝ automaticky. Ak si o tento kÛd neûiadal, mÙûeö t˙to spr·vu ignorovaù.
        </div>
      </div>
    </body>
    </html>
    \`;
"@
$content = $content -replace "(?s)const htmlContent =.*?</html>\s*`;", $newHtml
Set-Content src/app/api/auth/magic-link/route.ts $content

