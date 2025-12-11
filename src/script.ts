const imageInput = document.getElementById("image-input") as HTMLInputElement;
const previewImageBefore = document.getElementById("preview-image-before") as HTMLImageElement;
const previewImageAfter = document.getElementById("preview-image-after") as HTMLImageElement;
const label = document.getElementById("label") as HTMLLabelElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")

let window_height = window.innerHeight;
let window_width = window.innerWidth;
canvas.width = window_width;
canvas.height = window_height;
if (!ctx) {
    throw new Error("Could not get 2D context");
}

const ASCII = " .:-=+*#%@"

imageInput.addEventListener("change", () => {
    validateFileType()
});

const validateFileType = async () => {
    if (imageInput.value){
        const idxDot = imageInput.value.lastIndexOf(".") + 1;
        const extFile = imageInput.value.substr(idxDot, imageInput.value.length).toLowerCase();
        if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
            if (imageInput.files){
                displayFile(URL.createObjectURL(imageInput.files[0]!), previewImageBefore)
                await loadImageOnCanvas(previewImageBefore)
            }
        } else {
            alert("Only jpg, jpeg, png files are allowed!");
        }
    }
    return;
}

previewImageBefore.addEventListener("load", async () => {
    await loadImageOnCanvas(previewImageBefore)
})

const displayFile = (src: string, imgTag: HTMLImageElement) => {
    imgTag.src = src;
}

const loadImageOnCanvas = async (imgSrc : HTMLImageElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgSrc, 0,0, imgSrc.width, imgSrc.height)
    getImageData(imgSrc)
}

const getImageData = (imgSrc : HTMLImageElement) => {
    let imgD = ctx.getImageData(0,0, imgSrc.width, imgSrc.height)
    let pix = imgD.data;
    goThroughPixels(imgSrc, imgD, pix)
}

const goThroughPixels = (imgSrc : HTMLImageElement, imgd: ImageData, pix: Uint8ClampedArray) => {
    let average:number;
    let x;
    let s:string = "";
    for (let i = 0; i < pix.length; i+=4) {
        average = (pix[i]! + pix[i+1]! + pix[i+2]!)/3
        pix[i  ] = average
        pix[i+1] = average
        pix[i+2] = average
        x = average/25.6;
        if ((i/4) % canvas.width === 0 && i !== 0){
            s += "\n"    
        }
        s += `${ASCII[Math.round(x)-1]}`
    }
    label.textContent = s
    ctx.putImageData(imgd,0,0)
}