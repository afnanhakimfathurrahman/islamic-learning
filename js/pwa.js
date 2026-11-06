      // PWA install
      let deferredInstallPrompt = null;
      const installBtn = document.getElementById('pwa-install-btn');
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

      function showInstallBtn(show) {
installBtn.classList.toggle('hidden', !show);
installBtn.classList.toggle('flex', show);
      }

      window.addEventListener('beforeinstallprompt', (e) => {
e.preventDefault();
deferredInstallPrompt = e;
showInstallBtn(true);
      });

      installBtn.addEventListener('click', async () => {
if (deferredInstallPrompt) {
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  showInstallBtn(false);
} else if (isIOS) {
  alert('Untuk memasang: ketuk ikon Bagikan di Safari, lalu pilih "Tambahkan ke Layar Utama".');
}
      });

      window.addEventListener('appinstalled', () => {
deferredInstallPrompt = null;
showInstallBtn(false);
      });

      if (isIOS && !isStandalone) showInstallBtn(true);

      if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker registered:', reg.scope))
      .catch((err) => console.warn('Service Worker registration failed:', err));
  });
}
