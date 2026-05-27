!function(t){
let e=".custom-form",r=".custom-form-submit";

let o=(t={})=>{
  e=t.formClass||e;
  r=t.customSubmitClass||r;
  t_onReady(()=>{
    t_onFuncLoad("t_zeroForms__onReady",()=>{
      n()
    })
  })
};

let n=()=>{
  let t=document.querySelectorAll(e);
  if(0===t.length){
    console.error("[TKFORM] Не найдено ни одной формы с классом",e);
    return
  }

  let r=new Set;
  t.forEach(t=>{
    let e=t.closest(".t-rec");
    e&&r.add(e)
  });

  if(0===r.length){
    console.error("[TKFORM] Не найдено ни одного зеро блока с формами");
    return
  }

  i(t);
  s(r);
  a(t)
};

let i=t=>{
  t.forEach(t=>t.querySelector(".tn-form__submit")?.remove())
};

let a=t=>{
  t.forEach(t=>{
    Array.prototype.slice.call(
      t.querySelectorAll(".t-input:not(.t-inputquantity):not(.t-input-phonemask__wrap):not(.t-input-phonemask):not(.t-input__own-answer)")
    ).forEach(function(t){
      t.addEventListener("blur",function(t){
        t.target.value
          ? t.target.classList.add("t-input_has-content")
          : t.target.classList.remove("t-input_has-content")
      })
    })
  })
};

let s=t=>{
  t.forEach(t=>{
    let o=t.querySelector(".t396__artboard"),
        n=t.querySelectorAll(e),
        i=t.querySelector(r);

    if(!o){
      console.error("[TKFORM] Не найден элемент t396__artboard в блоке:",t);
      return false
    }

    if(0===n.length){
      console.error(`[TKFORM] Не найдено ни одной формы с классом ${e} в блоке`,t);
      return false
    }

    if(!i){
      console.error(`[TKFORM] Не найдено кнопки submit с классом ${r} в блоке`,t);
      return false
    }

    let a=o.dataset.artboardRecid
      ? "tk-form"+o.dataset.artboardRecid
      : "tk-form"+Math.floor(1e5+9e5*Math.random());

    let s=document.createElement("div");

    s.innerHTML=`<form class="t-form t-form_inputs-total_2 js-form-proccess" id="${a}" name="form778879734" action="https://forms.tildacdn.com/procces/" method="POST" role="form" data-formactiontype="2" data-inputbox=".t-input-group" data-success-callback="t396_onSuccess" data-success-popup="y" data-error-popup="y"></form>`;

    let u=s.childNodes[0];

    n.forEach(t=>{
      let e=t.querySelector("form");

      if(!e){
        console.error("[TKFORM] Не найдено формы в элементе",t);
        return false
      }

      let r=document.createElement("div");

      [...e.attributes].forEach(t=>r.setAttribute(t.name,t.value));
      r.append(...e.cloneNode(!0).childNodes);
      e.replaceWith(r);

      u.appendChild(t)
    });

    u.appendChild(i);
    o.appendChild(u);
    l(u,i)
  })
};

let l=(t,e)=>{
  if(!t){
    console.error("[TKFORM] Не найдено комбинированной формы");
    return false
  }

  if(!e){
    console.error("[TKFORM] Не найдено кнопки submit в форме",t);
    return false
  }

  e.setAttribute("type","submit");
  e.setAttribute("tabindex","0");
  e.setAttribute("onKeyDown","tkForm.handleSubmitKeyDown(event)");

  let r=e.getAttribute("style") || "";
  e.setAttribute("style",r+" cursor: pointer;");

  e.addEventListener("click",e=>{
    e.preventDefault();
    e.stopPropagation();

    if(t.dataset.tkSending==="true"){
      return false;
    }

    window.tildaForm.hideErrors(t);

    let r=window.tildaForm.validate(t);

    if(r.length){
      window.tildaForm.showErrors(t,r);
      return false
    }

    if(!t_forms__initBtnClick){
      console.error("[TKFORM] Функция t_forms__initBtnClick не инициализирована на странице");
      return false
    }

    t.dataset.tkSending="true";

    t_forms__initBtnClick(e);

    setTimeout(()=>{
      t.dataset.tkSending="false";
    },10000);

    return false;
  });

  e.classList.add("t-submit");

  t_onReady(function(){
    setTimeout(function(){
      window.t_upwidget__init
        ? t_zeroForms__onFuncLoad("t_upwidget__init",()=>e.classList.remove("t-submit"))
        : e.classList.remove("t-submit")
    },500)
  })
};

t.tkForm={
  init:o,
  handleSubmitKeyDown:function(t){
    (13===t.keyCode||32===t.keyCode)&&(
      t.preventDefault(),
      t.target.dispatchEvent(new Event("click"))
    )
  }
}
}(window);
