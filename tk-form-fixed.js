(function (window) {
  let formClass = '.custom-form';
  let customSubmitClass = '.custom-form-submit';

  function init(options = {}) {
    formClass = options.formClass || formClass;
    customSubmitClass = options.customSubmitClass || customSubmitClass;

    t_onReady(function () {
      t_onFuncLoad('t_zeroForms__onReady', function () {
        build();
      });
    });
  }

  function build() {
    const formBlocks = document.querySelectorAll(formClass);

    if (!formBlocks.length) {
      console.error('[TKFORM FIXED] Forms not found:', formClass);
      return;
    }

    const zeroBlocks = new Set();

    formBlocks.forEach(function (formBlock) {
      const rec = formBlock.closest('.t-rec');
      if (rec) zeroBlocks.add(rec);
    });

    if (!zeroBlocks.size) {
      console.error('[TKFORM FIXED] Zero blocks not found');
      return;
    }

    removeNativeSubmitButtons(formBlocks);
    initInputContentClass(formBlocks);
    createCombinedForms(zeroBlocks);
  }

  function removeNativeSubmitButtons(formBlocks) {
    formBlocks.forEach(function (formBlock) {
      const nativeSubmit = formBlock.querySelector('.tn-form__submit');
      if (nativeSubmit) nativeSubmit.remove();
    });
  }

  function initInputContentClass(formBlocks) {
    formBlocks.forEach(function (formBlock) {
      const inputs = formBlock.querySelectorAll(
        '.t-input:not(.t-inputquantity):not(.t-input-phonemask__wrap):not(.t-input-phonemask):not(.t-input__own-answer)'
      );

      inputs.forEach(function (input) {
        input.addEventListener('blur', function (event) {
          if (event.target.value) {
            event.target.classList.add('t-input_has-content');
          } else {
            event.target.classList.remove('t-input_has-content');
          }
        });
      });
    });
  }

  function createCombinedForms(zeroBlocks) {
    zeroBlocks.forEach(function (rec) {
      const artboard = rec.querySelector('.t396__artboard');
      const formBlocks = rec.querySelectorAll(formClass);
      const customSubmit = rec.querySelector(customSubmitClass);

      if (!artboard) {
        console.error('[TKFORM FIXED] Artboard not found in block:', rec);
        return;
      }

      if (!formBlocks.length) {
        console.error('[TKFORM FIXED] Forms not found in block:', rec);
        return;
      }

      if (!customSubmit) {
        console.error('[TKFORM FIXED] Custom submit button not found:', customSubmitClass);
        return;
      }

      const formId = artboard.dataset.artboardRecid
        ? 'tk-form-fixed-' + artboard.dataset.artboardRecid
        : 'tk-form-fixed-' + Math.floor(100000 + Math.random() * 900000);

      const wrapper = document.createElement('div');

      wrapper.innerHTML =
        '<form class="t-form t-form_inputs-total_2 js-form-proccess" ' +
        'id="' + formId + '" ' +
        'name="' + formId + '" ' +
        'action="https://forms.tildacdn.com/procces/" ' +
        'method="POST" ' +
        'role="form" ' +
        'data-formactiontype="2" ' +
        'data-inputbox=".t-input-group" ' +
        'data-success-callback="t396_onSuccess" ' +
        'data-success-popup="y" ' +
        'data-error-popup="y"></form>';

      const combinedForm = wrapper.firstChild;

      formBlocks.forEach(function (formBlock) {
        const innerForm = formBlock.querySelector('form');

        if (!innerForm) {
          console.error('[TKFORM FIXED] Inner form not found:', formBlock);
          return;
        }

        const divInsteadForm = document.createElement('div');

        Array.from(innerForm.attributes).forEach(function (attr) {
          divInsteadForm.setAttribute(attr.name, attr.value);
        });

        divInsteadForm.append(...innerForm.cloneNode(true).childNodes);
        innerForm.replaceWith(divInsteadForm);

        combinedForm.appendChild(formBlock);
      });

      combinedForm.appendChild(customSubmit);
      artboard.appendChild(combinedForm);

      prepareSubmit(combinedForm, customSubmit);
    });
  }

  function prepareSubmit(form, button) {
    if (!form || !button) return;

    button.setAttribute('type', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('onKeyDown', 'tkForm.handleSubmitKeyDown(event)');

    const oldStyle = button.getAttribute('style') || '';
    button.setAttribute('style', oldStyle + '; cursor: pointer;');

    button.addEventListener(
      'click',
      function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (form.dataset.tkSending === 'true') return false;

        window.tildaForm.hideErrors(form);

        const errors = window.tildaForm.validate(form);

        if (errors.length) {
          window.tildaForm.showErrors(form, errors);
          return false;
        }

        if (!window.t_forms__initBtnClick) {
          console.error('[TKFORM FIXED] t_forms__initBtnClick is not initialized');
          return false;
        }

        form.dataset.tkSending = 'true';
        button.dataset.tkSending = 'true';

        button.classList.add('t-submit');

        window.t_forms__initBtnClick(event);

        setTimeout(function () {
          form.dataset.tkSending = 'false';
          button.dataset.tkSending = 'false';
        }, 10000);

        return false;
      },
      true
    );

    t_onReady(function () {
      setTimeout(function () {
        button.classList.remove('t-submit');
      }, 500);
    });
  }

  window.tkForm = {
    init: init,

    handleSubmitKeyDown: function (event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        event.target.dispatchEvent(new Event('click'));
      }
    }
  };
})(window);
