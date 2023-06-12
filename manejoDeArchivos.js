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
        if (objs.length != 0) {
            // console.log('getProducts: ', objs);
            return objs;
        }
        console.log('No hay información en eñ archivo');
    }//END GET_PRODUCTS

    //Se obtiene el producto por el id del mismo
    async getProductId(id) {
        const objs = await this.readFile(this.path, this.nameFile);
        if (objs.length != 0) {
            const obj = objs.find(data => data.id == id);
            if (!Boolean(obj)) console.log('No existe el producto con el id: ' + id);
            // console.log(obj);
            return obj;
        }
        console.log('No hay información en eñ archivo');

    }//END GET_PRODUCT_ID

    //Actualiza un producto de los existentes
    async updateProduct(id, __title, __description, __price, __thumbnail, __code, __stock) {
        console.log(Boolean(''));
        this.getProducts().then(objs => {

            const obj = objs.find(data => data.id == id);

            if (Boolean(obj)) {
                const positionObj = objs.indexOf(obj);
                console.log('position: ', positionObj);
                // console.log(obj);
                const { id, title, description, price, thumbnail, code, stock } = obj;

                let title_change = '';
                let description_change = '';
                let price_chage = 0;
                let thumbnail_chage = '';
                let code_change = '';
                let stock_change = '';

                Boolean(__title) ? title_change = __title : title_change = title;
                Boolean(__description) ? description_change = __description : description_change = description;
                Boolean(__price) ? price_chage = __price : price_chage = Number(price);
                Boolean(__thumbnail) ? thumbnail_chage = __thumbnail : thumbnail_chage = thumbnail;
                Boolean(__code) ? code_change = __code : code_change = code;
                Boolean(__stock) ? stock_change = __stock : stock_change = Number(stock);

                const obj_update = { id, title_change, description_change, price_chage, thumbnail_chage, code_change, stock_change };
                objs.splice(positionObj, 1, obj_update);
                // console.log('**********************');
                // console.log('OBJs: ', objs);
                // console.log('*********************');
                // console.log(obj_update)
                this.writeFile(this.path, this.nameFile, objs);
                console.log('Se actualizó información, validar archivo');

            } else {
                console.log('No existe el producto para actualizar');
            }
        });
    }//END UPDATE-PRODUCT

    async deleteProduct(id) {
        const objs = await this.getProducts();
        const obj = objs.find(data => data.id == id);

        if (Boolean(obj)) {
            const positionObj = objs.indexOf(obj);
            objs.splice(positionObj, 1);
            console.log('Se eliminó información, validar archivo');
            await this.writeFile(this.path, this.nameFile, objs);
        } else {
            console.log('No existe el producto para eliminar');
        }

    }//END DELETE-PRODUCT


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
// product1.updateProduct(4, '', '', 666, 'rrr', '69A', '4');
// product1.deleteProduct(4);
product1.addProduct('madera', 'Sustancia dura y fibrosa', 50000, 'madera.png', 'RB77', 45);


const product2 = new ProductManager();
// product2.addProduct('madera', 'Sustancia dura y fibrosa', 50000, 'madera.png', 'RB77', 45);


