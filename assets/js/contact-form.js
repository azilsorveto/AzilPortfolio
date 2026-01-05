(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var form = document.getElementById('cform');
    if(!form) return;

    var successBox = form.parentNode.querySelector('.alert-success');
    var submitBtn = form.querySelector('.send-message-btn');

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var endpoint = form.getAttribute('data-endpoint') || '';
      if (!endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1) {
        alert('Please configure your Formspree endpoint in the form "data-endpoint" attribute (replace YOUR_FORM_ID).');
        return;
      }

      var formData = new FormData(form);
      // optional: include _subject and _replyto for Formspree
      if (!formData.get('_subject')) formData.append('_subject', 'New message from portfolio site');
      if (!formData.get('_replyto') && formData.get('email')) formData.append('_replyto', formData.get('email'));

      if (submitBtn) { submitBtn.disabled = true; }

      fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(function(response){
        if (response.ok) {
          form.reset();
          if (successBox) { successBox.style.display = 'block'; }
        } else {
          return response.json().then(function(data){
            var err = (data && data.error) ? data.error : 'Submission error';
            alert('Error: ' + err);
          });
        }
      }).catch(function(err){
        alert('Could not send message. Please try again later.');
      }).finally(function(){
        if (submitBtn) { submitBtn.disabled = false; }
      });
    });
  });
})();
