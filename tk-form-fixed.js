!function(t){
let e=".custom-form",r=".custom-form-submit";

let o=(opts={})=>{
  e=opts.formClass||e;
  r=opts.customSubmitClass||r;

  t_onReady(()=>{
    t_onFuncLoad("t_zeroForms__onReady",()=>{n()})
  })
};

let n=()=>{
  let forms=document.querySelectorAll(e);

  if(!forms.length){
    console.error("[TKFORM FIXED] Forms not found:",e);
    return;
  }

  let records=new Set;

  forms.forEach(form=>{
    let rec=form.closest(".t-rec");
    if(rec) records.add(rec);
  });

  if(!records.size){
    console.error("[TKFORM FIXED] Zero blocks not found");
    return;
  }

  removeNativeButtons(forms);
  initInputBlur(forms);
  buildCombinedForms(records);
};

let removeNativeButtons=forms=>{
  forms.forEach(form=>{
    form.querySelector(".tn-form__submit")?.remove();
  });
};

let initInputBlur=forms=>{
  forms.forEach(form=>{
    form.querySelectorAll(".t-input:not(.t-inputquantity):not(.t-input-phonemask__wrap):not(.t-input-phonemask):not(.t-input__own-answer)").forEach(input=>{
      input.addEventListener("blur",event=>{
        event.target.value
          ? event.target.classList.add("t-input_has-content")
          : event.target.classList.remove("t-input_has-content");
      });
    });
  });
};

let cleanDuplicateSystemFields=(container,isFirstForm)=>{
  if(isFirstForm) return;

  container.querySelectorAll('input[type="hidden"]').forEach(input=>{
    let name=input.getAttribute("name")||"";

    if(
      name==="formservices[]" ||
      name.indexOf("tildaspec-")===0 ||
      name==="form-spec-comments" ||
      name==="formid" ||
      name==="formskey"
    ){
      input.remove();
    }
  });
};

let buildCombinedForms=records=>{
  records.forEach(rec=>{
    let artboard=rec.querySelector(".t396__artboard");
    let formBlocks=rec.querySelectorAll(e);
    let customButton=rec.querySelector(r);

    if(!artboard){
      console.error("[TKFORM FIXED] Artboard not found:",rec);
      return;
    }

    if(!formBlocks.length){
      console.error("[TKFORM FIXED] Forms not found in block:",rec);
      return;
    }

    if(!customButton){
      console.error("[TKFORM FIXED] Submit button not found:",r);
      return;
    }

    let id=artboard.dataset.artboardRecid
      ? "tk-form"+artboard.dataset.artboardRecid
      : "tk-form"+Math.floor(1e5+9e5*Math.random());

    let wrapper=document.createElement("div");

    wrapper.innerHTML=`<form class="t-form t-form_inputs-total_2 js-form-proccess" id="${id}" name="form778879734" action="https://forms.tildacdn.com/procces/" method="POST" role="form" data-formactiontype="2" data-inputbox=".t-input-group" data-success-callback="t396_onSuccess" data-success-popup="y" data-error-popup="y"></form>`;

    let combinedForm=wrapper.childNodes[0];

    formBlocks.forEach((formBlock,index)=>{
      let innerForm=formBlock.querySelector("form");

      if(!innerForm){
        console.error("[TKFORM FIXED] Inner form not found:",formBlock);
        return;
      }

      let div=document.createElement("div");

      [...innerForm.attributes].forEach(attr=>{
        div.setAttribute(attr.name,attr.value);
      });

      div.append(...innerForm.cloneNode(true).childNodes);

      cleanDuplicateSystemFields(div,index===0);

      innerForm.replaceWith(div);
      combinedForm.appendChild(formBlock);
    });

    combinedForm.appendChild(customButton);
    artboard.appendChild(combinedForm);

    prepareSubmit(combinedForm,customButton);
  });
};

let prepareSubmit=(form,button)=>{
  button.setAttribute("type","submit");
  button.setAttribute("tabindex","0");
  button.setAttribute("onKeyDown","tkForm.handleSubmitKeyDown(event)");

  let style=button.getAttribute("style")||"";
  button.setAttribute("style",style+" cursor: pointer;");

  button.addEventListener("click",event=>{
    event.preventDefault();
    event.stopPropagation();

    if(form.dataset.tkSending==="true") return false;

    window.tildaForm.hideErrors(form);

    let errors=window.tildaForm.validate(form);

    if(errors.length){
      window.tildaForm.showErrors(form,errors);
      return false;
    }

    if(!t_forms__initBtnClick){
      console.error("[TKFORM FIXED] t_forms__initBtnClick not initialized");
      return false;
    }

    form.dataset.tkSending="true";

    t_forms__initBtnClick(event);

    setTimeout(()=>{
      form.dataset.tkSending="false";
    },10000);

    return false;
  });

  button.classList.add("t-submit");

  t_onReady(function(){
    setTimeout(function(){
      window.t_upwidget__init
        ? t_zeroForms__onFuncLoad("t_upwidget__init",()=>button.classList.remove("t-submit"))
        : button.classList.remove("t-submit");
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
