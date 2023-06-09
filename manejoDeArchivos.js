import { data } from './data.js';
import fs from 'fs';
import { access, constants } from 'node:fs/promises';

const products = [...data];



class ProductManager {

    static identity = 0;
    nameFile = 'storage.json';
    countProducts = products.length;    //Obtengo la cantidad de productos que tiene el objeto en memoria

    constructor() {
        this.path = './FILES';
    }

    addId(count) {
        return count = count + 1;
    }//END ADD_ID

    //Ingresa valores a un archivo con nomnre product.json
    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            let id = this.addId(this.countProducts);
            const product = { id, title, description, price, thumbnail, code, stock };
            products.push(product);
            await this.writeFile(this.path, this.nameFile, products);
        } catch (err) {
            console.log('ERROR-ADD_PRODUCT', err.message);
        }


    }//END ADD_PRODUCT

    //Se obtiene los productos masivamente
    async getProducts() {
        const objs = await this.readFile(this.path, this.nameFile);
        if(objs.length != 0){
            // console.log('getProducts: ', objs);
            return objs;
        }    
        console.log('No hay información en eñ archivo');
    }//END GET_PRODUCTS

    //Se obtiene el producto por el id del mismo
    async getProductId(id) {
        const objs = await this.readFile(this.path, this.nameFile);
        if (objs.length != 0){
            const obj = objs.find(data => data.id == id);
            if (!Boolean(obj)) console.log('No existe el producto con el id: ' + id);
            // console.log(obj);
            return obj;
        }
        console.log('No hay información en eñ archivo');
     
    }//END GET_PRODUCT_ID

    async updateProduct(id, updateData) {
        console.log(Boolean(''));
        this.getProducts().then( objs => {
            const obj = objs.find(data => data.id == id);        
            if(Boolean(obj)){
               console.log(updateData);
            }
        });
    }

    /**********************************************************************************************************
     **********************************************************************************************************
     **********************************************************************************************************
    */
    async writeFile(path, nameFile, data) {
        try {
            await fs.promises.writeFile(`${path}/${nameFile}`, JSON.stringify(data));
            console.log('Se escribio con exito la información');
        } catch (err) {
            console.log('ERROR-WRITE_FILE: ', err.message);
        }
    }//END WRITE_FILE

    //Leer archivos de tipo JSON de manera asincronica
    async readFile(path, nameFile) {
        let acces = false;
        let size = fs.statSync(`${path}/${nameFile}`).size

        try {
            await fs.promises.access(`${path}/${nameFile}`, constants.R_OK | constants.W_OK);
            console.log('can access');
            acces = true;
        } catch (err) {
            acces = false;
            console.error('can not access');
            console.log("ERROR: ", err.message);
        }
        if (acces && size != 0) {
            console.log(acces)
            try {
                const dataJSON = await fs.promises.readFile(`${path}/${nameFile}`, { encoding: 'utf8' });
                // console.log(fs.statSync(`${path}/${nameFile}`).size);
                const data = JSON.parse(dataJSON);
                return data;
            } catch (err) {
                console.log('ERROR: ', err.message);
            }
        } else {
            const data = []
            console.log('Tienes acceso, pero no hay información en el archivo: ' + nameFile);
            return data;
        }
    }//END READ_FILE



    /*********************************************************************************
     *********************************************************************************
     *********************************************************************************
     *                                 PRUEBAS 
     *********************************************************************************
     *********************************************************************************
     *********************************************************************************/
    // writeFile(path, nameFile, data){
    // fs.writeFile(`${path}/${nameFile}`, JSON.stringify(data), (err) => {
    //     if (err) throw err;
    //     else console.log(`Se escribio con exito la información`);
    // });
    // }

    // readFile(path, nameFile){
    //     console.log(`${path}/${nameFile}`);
    //     let data = fs.readFileSync(`./FILES/storage.json`, 'utf-8');  
    //     console.log(`Se lee el archivo ${nameFile} exitosamente`);   
    //     let obj = JSON.parse(data);
    //     //console.log(JSON.parse(data));
    //     return obj;
    // }

    // readFile(path, nameFile) {
    //     fs.readFile(`${path}/${nameFile}`, 'utf-8', (err, data) => {
    //         if (err) throw err
    //         console.log(`Se lee el archivo ${nameFile} exitosamente`);
    //         let info = JSON.parse(data);
    //         // console.log(info)
    //         return info;
    //     });
    // }//END READ_FILE

}


const product1 = new ProductManager();
// product1.getProducts();
// product1.getProductId(1);
const updateData = {title: "Hola", description: "aaaa"}
product1.updateProduct(1, updateData);
// product1.addProduct('madera', 'Sustancia dura y fibrosa', 50000, 'madera.png', 'RB77', 45);


const product2 = new ProductManager();
// product2.addProduct('madera', 'Sustancia dura y fibrosa', 50000, 'madera.png', 'RB77', 45);


