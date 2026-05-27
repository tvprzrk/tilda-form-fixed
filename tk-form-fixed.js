window.tkForm = {
  init: function (options) {
    const formClass = options.formClass || '.custom-form';
    const customSubmitClass = options.customSubmitClass || '.custom-form-submit';

    const formBlocks = Array.from(document.querySelectorAll(formClass));
    const submitButtons = Array.from(document.querySelectorAll(customSubmitClass));

    if (!formBlocks.length || !submitButtons.length) return;

    submitButtons.forEach(function (button) {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (button.dataset.tkSending === 'true') return;
        button.dataset.tkSending = 'true';

        const firstFormBlock = formBlocks[0];
        const firstForm = firstFormBlock.querySelector('form') || firstFormBlock;

        if (!firstForm) return;

        formBlocks.forEach(function (block) {
          const form = block.querySelector('form') || block;
          if (form !== firstForm) {
            form.addEventListener('submit', function (event) {
              event.preventDefault();
              event.stopImmediatePropagation();
              return false;
            }, true);
          }
        });

        const submit = firstForm.querySelector('.t-submit, button[type="submit"], input[type="submit"]');

        if (submit) {
          submit.click();
        } else if (firstForm.requestSubmit) {
          firstForm.requestSubmit();
        }

        setTimeout(function () {
          button.dataset.tkSending = 'false';
        }, 8000);
      }, true);
    });
  }
};
