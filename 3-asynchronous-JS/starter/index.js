const fs = require('fs');
const superagent = require('superagent');

const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);
        const res = await superagent.get(`http://dog.ceo/api/breed/${data}/images/random`);
        console.log(res.body.message);
        await writeFilePro('dog-img.txt', res.body.message);
        console.log('image saved to file!');
    } catch (err) {
        console.log(err);
    }

    return '2.1: return from getDogPic';
}

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });
}

const writeFilePro = (file, message) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${__dirname}/${file}`, message, err => {
            if (err) reject(err);
            resolve('File has been written');
        });
    });
}

( async () => {
    try {
        console.log('1: First');
        const x = await getDogPic();
        console.log(`2: ${x}`);
        console.log('3: finished');
    } catch (err) {
        console.log(err);
    }
}
)();