

const form = document.querySelector("#newsletterForm");
form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const Formbody = JSON.stringify({
        _csrf: form.elements._csrf.value,
        name: form.elements.name.value,
        email: form.elements.email.value
    });
    const Formheaders = {"content-type": "application/json"};
    const container = document.body.querySelector("#newsletterSignUpFormContainer");
    fetch("/api/newsletter-signup",{method:"POST",body:Formbody,headers: Formheaders})
    .then(resp => 
        {
            if(resp.status < 200 || resp.status >=300)
            {
                throw new Error(`request failed with status  ${resp.status}`);
            }
            return resp;
    }).then(json =>{
        container.innerHTML = "<b>Thank you for signing up!</b>";
    }).catch(err =>{
        container.innerHTML = `we're sorry we had a problem signing up,please <a href='/newsletter-signup'>try again</a>`;
    });
});