(function($){
  $(function(){
    // Open a mini browser popup when elements with .js-mini-browser are clicked
    $(document).on('click', '.js-mini-browser', function(e){
      e.preventDefault();
      var url = $(this).attr('href') || $(this).data('mfp-src');
      var id = 'mfp-mini-browser-' + Date.now();
      var $el = $('<div id="'+id+'" class="mfp-mini-browser">' +
        '<div class="mfp-browser-top"><div class="mfp-url">'+url+'</div><button class="mfp-top-close" aria-label="Close">\u00d7</button></div>' +
        '<div class="mfp-loader-overlay" aria-hidden="false">' +
          '<div class="mfp-loader-spinner" role="status" aria-label="Loading"></div>' +
        '</div>' +
        '<iframe src="'+url+'" frameborder="0" class="mfp-browser-iframe" sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe>' +
        '</div>');

      $('body').append($el);

      $.magnificPopup.open({
        items: { src: '#'+id, type: 'inline' },
        closeOnBgClick: true,
        showCloseBtn: false,
        mainClass: 'mfp-no-margins mfp-with-zoom',
        callbacks: {
          open: function() {
            var $popup = $('#'+id);
            var $iframe = $popup.find('iframe');
            var $loader = $popup.find('.mfp-loader-overlay');
            // ensure loader visible
            $loader.show();

            // hide loader on successful load
            $iframe.on('load', function(){
              $loader.fadeOut(180);
            });

            // show error if it fails to load
            $iframe.on('error', function(){
              $loader.find('.mfp-loader-spinner').hide();
              if (!$popup.find('.mfp-load-error').length) {
                $loader.append('<div class="mfp-load-error">Failed to load content</div>');
              }
            });

            // fallback: if still white after 12s, show a small message
            setTimeout(function(){
              if ($loader.is(':visible')) {
                if (!$popup.find('.mfp-load-error').length) {
                  $loader.find('.mfp-loader-spinner').hide();
                  $loader.append('<div class="mfp-load-error">Still loading... try refresh</div>');
                }
              }
            }, 12000);
          },
          close: function() { $('#'+id).remove(); }
        }
      });
    });

    // Close button inside the mini browser
    $(document).on('click', '.mfp-top-close', function(){
      $.magnificPopup.close();
    });
  });
})(jQuery);
