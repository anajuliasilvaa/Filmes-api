import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineList - Seu Catálogo de Filmes",
  description: "Explore o mundo do cinema com nosso catálogo completo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/png" href="/img/aba.png" />
        
        {/* Bootstrap CSS */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        
        {/* Icon Font Stylesheet */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css"
          rel="stylesheet"
        />
        
        {/* Libraries Stylesheet */}
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          
          <main>
            {children}
          </main>
          
          <Footer />

          {/* Back to Top */}
          <a href="#" className="btn btn-dark py-3 fs-4 back-to-top">
            <i className="bi bi-arrow-up"></i>
          </a>

          {/* JavaScript Libraries */}
          <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js" strategy="beforeInteractive" />
          <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js" strategy="afterInteractive" />
          
          {/* Custom Scripts */}
          <Script id="custom-scripts" strategy="afterInteractive">
            {`
              // Back to top button
              $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                  $('.back-to-top').fadeIn('slow');
                } else {
                  $('.back-to-top').fadeOut('slow');
                }
              });
              $('.back-to-top').click(function () {
                $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
                return false;
              });
              
              // Active navbar link
              $(document).ready(function() {
                var currentPath = window.location.pathname;
                $('.navbar-nav .nav-link').each(function() {
                  var linkPath = $(this).attr('href');
                  if (linkPath === currentPath) {
                    $(this).addClass('active');
                  } else {
                    $(this).removeClass('active');
                  }
                });
                
                // Initialize WOW.js animations
                new WOW().init();
              });
            `}
          </Script>
        </AuthProvider>
      </body>
    </html>
  );
}
