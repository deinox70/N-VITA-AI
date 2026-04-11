import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VitaHealth AI — Health Intelligence',
  description: 'Upload your health report and get AI-powered disease risk predictions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              document.addEventListener('contextmenu', function(e) { e.preventDefault(); return false; });
              document.addEventListener('keydown', function(e) {
                if (
                  e.key === 'F12' ||
                  (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].includes(e.key)) ||
                  (e.ctrlKey && ['U','u','S','s'].includes(e.key))
                ) { e.preventDefault(); e.stopPropagation(); return false; }
              });
              var devtools = { open: false };
              setInterval(function() {
                if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
                  if (!devtools.open) { devtools.open = true; document.body.style.filter = 'blur(10px)'; document.body.style.pointerEvents = 'none'; }
                } else {
                  if (devtools.open) { devtools.open = false; document.body.style.filter = ''; document.body.style.pointerEvents = ''; }
                }
              }, 500);
              document.addEventListener('selectstart', function(e) { e.preventDefault(); return false; });
              document.addEventListener('dragstart', function(e) { e.preventDefault(); return false; });
            })();
          `
        }} />
      </body>
    </html>
  )
}
