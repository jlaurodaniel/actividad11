const fs = require('fs');
const path = require('path');
const filePath = 'jose_ulises_lauro.txt';
var SimpleHashTable = require('simple-hashtable');
var hashtable = new SimpleHashTable();
var postingHashtable = new SimpleHashTable();

let allProccessEnd_seg = 0;
let allProccessEnd_ms = 0;

const recordWordsFromArray = (array) => {
    let words = {};
    array.forEach((word, index) => {
        words[word] = 1;
        for (let i = 0; i < array.length; i++) {
            if (array[i] == word) {
                words[word] = words[word] + 1;
                //console.log(array[index].trim() + '** es igual que **' + word + ' count valor de =>' + words[word] + '\n')
            } else {
                // console.log('\n' + array[index].trim() + '\nno es igual que\n' + word)
            }
        }
        //  **********************    Uso de la HashTable y validacion     **********************
        if (words[word] > 1 || word.length > 1) {
            hashtable.put(word.toString(), words[word])
            fs.appendFileSync('Nombres y matriculas.txt', + word.toString() + ' ; ' + words[word] + ' \n ');
            recordBetweenFiles(word, array);
        }
    })

    console.log(array);
    return words;
}

const recordBetweenFiles = (word2Find, arrayProcesed) => {
    let counter = 0;
    arrayProcesed.forEach((word, index) => {
        if (word2Find == word) {
            counter++;
        }
    })
    //  **********************    Uso de la HashTable     **********************
    postingHashtable.put(word2Find, counter);
    fs.appendFileSync('posting.txt', word2Find + ' ; ' + counter + ' ; ' + counter / arrayProcesed.length + '\n ');
    return counter;
}
//Lectura de todos los archivos html en la carpeta
const files = fs.readdirSync('archivos/Files');
//Txt con los nombres y matriculas del equipo
if (!fs.existsSync(filePath)) {
    fs.writeFileSync('Nombres y matriculas.txt', '\nLauro Daniel Jiménez Custodio-4512077 Ulises Perez Gomez-2888460  Jose Luis Aguilar-2806108\n');
}
//posting file
if (!fs.existsSync(filePath)) {
    fs.writeFileSync('posting.txt', '\n*******  Archivo Posting   *********\n');
}
if (!fs.existsSync(filePath)) {
    fs.writeFileSync('documentsPath.txt', '\n*******  Paths de archivos   *********\n');
}
// iteracion de los nombres de los archivos
files.forEach((file, index) => {
    const label = '\nTiempo para ' + path.join('archivos/Files', file + ' => ');

    fs.appendFileSync('documentsPath.txt', index + ' => ' + file + '\n')
    //Entro a la lectura de cada archivo
    fs.readFile(path.join('archivos/Files', file), (error, stream) => {
        if (error) {
            console.error(error)
        } else {
            //Inicia bandera del timer 
            const start = process.hrtime();
            //Se parsea el stream a String para posterior hacer un replace con una expresion regular Regex
            const stringData = stream.toString()//.replace(regex, ' ');
            //Una vez obtenido el String sin las etiquetas,lo guardamos como un archivo nuevo 
            let splitedString = stringData.split('\s');
            splitedString = stringData.split(' ');
            splitedString.sort();
            const r = recordWordsFromArray(splitedString);
            console.log(r);

            /*
            splitedString.forEach(stringData => {
                fs.appendFileSync('archivos/Files2/' + file, stringData + '\n ');
            })*/
            //Finaliza e imprime bandera del timer
            const end = process.hrtime(start);
            const timeMessage = '\n**** ' + label + end[0] + ' seg con ' + end[1] + ' ms \n'
            allProccessEnd_seg += end[0];
            allProccessEnd_ms += end[1] / 10000;
            let RECORD_MESSAGE = '**** Record de tiempo total de ejecucion => ' + allProccessEnd_seg + ' Seg     | - ' + allProccessEnd_ms + ' ms - |\n';
            //console.log(RECORD_MESSAGE)
            console.log(timeMessage);
            //Añadismo tiempo al file txt
            /*fs.appendFileSync('Nombres y matriculas.txt', timeMessage);
            fs.appendFileSync('Nombres y matriculas.txt', RECORD_MESSAGE);*/
        }
    })
})