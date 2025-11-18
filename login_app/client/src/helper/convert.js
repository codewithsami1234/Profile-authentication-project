/** image onto base64 */
export default function convertToBase64(file){
    return new Promise((resolve, reject) => {
        if(!file) return reject("No file provided!");

        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        }
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}
