(function(window){

window.tkForm = {
  init: function(options){

    const formClass = options.formClass || '.custom-form';
    const submitClass = options.customSubmitClass || '.custom-form-submit';

    const forms = Array.from(document.querySelectorAll(formClass));
    const submit = document.querySelector(submitClass);

    if(!forms.length || !submit) return;

    const mainForm = forms[0];

    forms.slice(1).forEach(function(form){

      form.querySelectorAll('input, textarea, select').forEach(function(field){

        field.removeAttribute('data-tilda-req');
        field.removeAttribute('required');

      });

    });

    submit.addEventListener('click', function(e){

      e.preventDefault();
      e.stopPropagation();

      if(submit.dataset.sending === '1') return;
      submit.dataset.sending = '1';

      mainForm.querySelectorAll('[data-merged-field]').forEach(function(el){
        el.remove();
      });

      forms.slice(1).forEach(function(form){

        form.querySelectorAll('input, textarea, select').forEach(function(field){

          if(field.type === 'submit' || field.type === 'button') return;

          const clone = field.cloneNode(true);

          clone.removeAttribute('data-tilda-req');
          clone.removeAttribute('required');

          clone.setAttribute('data-merged-field', '1');

          clone.style.position = 'absolute';
          clone.style.left = '-99999px';
          clone.style.opacity = '0';
          clone.style.pointerEvents = 'none';
          clone.style.width = '1px';
          clone.style.height = '1px';

          if(field.type === 'checkbox' || field.type === 'radio'){
            clone.checked = field.checked;
          } else {
            clone.value = field.value;
          }

          mainForm.appendChild(clone);

        });

      });

      const nativeSubmit = mainForm.querySelector(
        '.t-submit, button[type="submit"], input[type="submit"]'
      );

      if(nativeSubmit){
        nativeSubmit.click();
      }

      setTimeout(function(){
        submit.dataset.sending = '0';
      }, 5000);

    });

  }
};

})(window);
