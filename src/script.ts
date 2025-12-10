const fileName = document.getElementById("image-input") as HTMLInputElement;

fileName.addEventListener("change", () => {
    validateFileType()
});

const validateFileType = () => {
    if (fileName.value){
        const idxDot = fileName.value.lastIndexOf(".") + 1;
        const extFile = fileName.value.substr(idxDot, fileName.value.length).toLowerCase();
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
            console.log(1)
        } else {
            alert("Only jpg, jpeg, png files are allowed!");
        }
    }
    return;
}