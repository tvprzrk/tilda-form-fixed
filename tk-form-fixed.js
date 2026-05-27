!function(t){
  let e=".custom-form",r=".custom-form-submit";

  const o=(t={})=>{
    e=t.formClass||e;
    r=t.customSubmitClass||r;

    t_onReady(()=>{
      t_onFuncLoad("t_zeroForms__onReady",()=>{
        n();
      });
    });
  };

  const n=()=>{
    let forms=document.querySelectorAll(e);

    if(forms.length===0){
      console.error("[TKFORM FIXED] Не найдено ни одной формы с классом",e);
      return;
    }

    let records=new Set;

    forms.forEach(form=>{
      let rec=form.closest(".t-rec");
      if(rec) records.add(rec);
    });

    if(records.size===0){
      console.error("[TKFORM FIXED] Не найдено ни одного зеро блока с формами");
      return;
    }

    i(forms);
    s(records);
    a(forms);
  };

  const i=forms=>{
    forms.forEach(form=>{
      form.querySelector(".tn-form__submit")?.remove();
    });
  };

  const a=forms=>{
    forms.forEach(form=>{
      Array.prototype.slice.call(
        form.querySelectorAll(".t-input:not(.t-inputquantity):not(.t-input-phonemask__wrap):not(.t-input-phonemask):not(.t-input__own-answer)")
      ).forEach(function(input){
        if(input.dataset.tkBlurFixed==="true") return;
        input.dataset.tkBlurFixed="true";

        input.addEventListener("blur",function(event){
          if(event.target.value){
            event.target.classList.add("t-input_has-content");
          }else{
            event.target.classList.remove("t-input_has-content");
          }
        });
      });
    });
  };

  const s=records=>{
    records.forEach(rec=>{
      if(rec.dataset.tkFormFixedReady==="true") return;
      rec.dataset.tkFormFixedReady="true";

      let artboard=rec.querySelector(".t396__artboard");
      let forms=rec.querySelectorAll(e);
      let submit=rec.querySelector(r);

      if(!artboard){
        console.error("[TKFORM FIXED] Не найден элемент t396__artboard в блоке:",rec);
        return;
      }

      if(forms.length===0){
        console.error(`[TKFORM FIXED] Не найдено ни одной формы с классом ${e} в блоке`,rec);
        return;
      }

      if(!submit){
        console.error(`[TKFORM FIXED] Не найдено кнопки submit с классом ${r} в блоке`,rec);
        return;
      }

      let id=artboard.dataset.artboardRecid
        ? "tk-form"+artboard.dataset.artboardRecid
        : "tk-form"+Math.floor(1e5+9e5*Math.random());

      let wrapper=document.createElement("div");

      wrapper.innerHTML=`<form class="t-form t-form_inputs-total_2 js-form-proccess" id="${id}" name="form778879734" action="https://forms.tildacdn.com/procces/" method="POST" role="form" data-formactiontype="2" data-inputbox=".t-input-group" data-success-callback="t396_onSuccess" data-success-popup="y" data-error-popup="y"></form>`;

      let combinedForm=wrapper.childNodes[0];

      forms.forEach(formBlock=>{
        let innerForm=formBlock.querySelector("form");

        if(!innerForm){
          console.error("[TKFORM FIXED] Не найдено формы в элементе",formBlock);
          return;
        }

        let div=document.createElement("div");

        [...innerForm.attributes].forEach(attr=>{
          div.setAttribute(attr.name,attr.value);
        });

        div.append(...innerForm.cloneNode(true).childNodes);
        innerForm.replaceWith(div);

        combinedForm.appendChild(formBlock);
      });

      combinedForm.appendChild(submit);
      artboard.appendChild(combinedForm);

      l(combinedForm,submit);
    });
  };

  const l=(form,submit)=>{
    if(!form){
      console.error("[TKFORM FIXED] Не найдено комбинированной формы");
      return;
    }

    if(!submit){
      console.error("[TKFORM FIXED] Не найдено кнопки submit в форме",form);
      return;
    }

    submit.setAttribute("type","submit");
    submit.setAttribute("tabindex","0");
    submit.setAttribute("onKeyDown","tkForm.handleSubmitKeyDown(event)");

    let style=submit.getAttribute("style")||"";
    submit.setAttribute("style",style+" cursor: pointer;");

    if(submit.dataset.tkClickFixed==="true") return;
    submit.dataset.tkClickFixed="true";

    submit.addEventListener("click",event=>{
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if(form.dataset.tkSending==="true") return false;

      window.tildaForm.hideErrors(form);

      let errors=window.tildaForm.validate(form);

      if(errors.length){
        window.tildaForm.showErrors(form,errors);
        return false;
      }

      if(!t_forms__initBtnClick){
        console.error("[TKFORM FIXED] Функция t_forms__initBtnClick не инициализирована на странице");
        return false;
      }

      form.dataset.tkSending="true";

      t_forms__initBtnClick(event);

      setTimeout(()=>{
        form.dataset.tkSending="false";
      },10000);

      return false;
    },true);

    submit.classList.add("t-submit");

    t_onReady(function(){
      setTimeout(function(){
        if(window.t_upwidget__init){
          t_zeroForms__onFuncLoad("t_upwidget__init",()=>submit.classList.remove("t-submit"));
        }else{
          submit.classList.remove("t-submit");
        }
      },500);
    });
  };

  t.tkForm={
    init:o,
    handleSubmitKeyDown:function(event){
      if(event.keyCode===13||event.keyCode===32){
        event.preventDefault();
        event.target.dispatchEvent(new Event("click"));
      }
    }
  };
}(window);
