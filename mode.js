/* يحدد نمط الموقع: full إن ضبط API_BASE (حسابات وجمع قرارات)، وإلا static (أداة تعمل في المتصفح فقط). */
document.documentElement.setAttribute('data-mode',(window.CONFIG&&CONFIG.API_BASE)?'full':'static');
(function(){var c=window.CONFIG&&CONFIG.CONTACT;if(!c)return;
  document.querySelectorAll('.contact-fill').forEach(function(e){e.textContent=c});
  document.querySelectorAll('.contact-line').forEach(function(e){e.hidden=false});})();
