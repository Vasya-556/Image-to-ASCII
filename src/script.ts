const errorMessage = document.getElementById("error-message") as HTMLParagraphElement;
const imageInput = document.getElementById("image-input") as HTMLInputElement;
const previewImageBefore = document.getElementById("preview-image-before") as HTMLImageElement;
const ASCIIOutput = document.getElementById("label") as HTMLPreElement;
const copyButton = document.getElementById("copy-button") as HTMLButtonElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")

let window_height = window.innerHeight;
let window_width = window.innerWidth;
canvas.width = window_width;
canvas.height = window_height;

if (!ctx) {
    throw new Error("Could not get 2D context");
}

const ASCII = "@%#*+=-:. "
let str:string = "";

imageInput.addEventListener("change", () => {
    errorMessage.style.display = "none"
    validateFileType()
});

const validateFileType = async () => {
    if (!imageInput.value) {
        return
    }
    
    const idxDot = imageInput.value.lastIndexOf(".") + 1;
    const extFile = imageInput.value.substr(idxDot, imageInput.value.length).toLowerCase();
        
    if (!(extFile == "jpg" || extFile == "jpeg" || extFile == "png")){
        errorMessage.style.display = "block"
        return
    }

    if (imageInput.files){
        previewImageBefore.src = URL.createObjectURL(imageInput.files[0]!)
        await loadImageOnCanvas(previewImageBefore)
    }
}

previewImageBefore.addEventListener("load", async () => {
    await loadImageOnCanvas(previewImageBefore)
})

const loadImageOnCanvas = async (imgSrc : HTMLImageElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgSrc, 0,0, imgSrc.width, imgSrc.height)
    drawASCII(imgSrc)
}

const drawASCII = (imgSrc : HTMLImageElement) => {
    let imgD = ctx.getImageData(0,0, imgSrc.width, imgSrc.height)

    let average:number;
    let offset: number;
    let r:number;
    let g:number;
    let b:number;

    for (let i = 0; i < imgSrc.height; i++) {
        for (let j = 0; j < imgSrc.width; j++) {
            offset = (i * imgSrc.width + j) * 4
            r = imgD.data[offset  ]!
            g = imgD.data[offset+1]!
            b = imgD.data[offset+2]!
            average = (r + g + b) / 3
            str += ASCII[Math.floor((average/255) * (ASCII.length - 1))]!
        }
        str += '\n'
    }
    ASCIIOutput.textContent = str
    ctx.putImageData(imgD,0,0)
}

copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(str)
    copyButton.textContent = "Copied"
    setTimeout(() => {
        copyButton.textContent = "Copy result"
    }, 2000)
})