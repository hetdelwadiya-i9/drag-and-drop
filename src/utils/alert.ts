export const alertGenerator = (text: string, type: string) => {
       if(type==="error") {
              document.getElementById("alert")!.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">`+text + `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
       } else {
              document.getElementById("alert")!.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">`+text + `<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
       }
}