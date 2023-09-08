import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';


const config = {
    apiKey: "AIzaSyCJsHJXQPx5K2dmSvLLPyvV1XrSBvB8dVQ",
    authDomain: "webproject-c5878.firebaseapp.com",
    databaseURL: "https://webproject-c5878-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "webproject-c5878",
    storageBucket: "webproject-c5878.appspot.com",
    messagingSenderId: "448524087667",
    appId: "1:448524087667:web:09d602a579731fcc2f5506",
    measurementId: "G-6JNYH4QH5K"
};
if (firebase.apps.length === 0)
    firebase.initializeApp(config);

export const FirebaseAuth = firebase.auth();
export const FirebaseEmailAuthProvider = firebase.auth.EmailAuthProvider;
const firestore = firebase.firestore();

export const users = firestore.collection('users');
export const items = firestore.collection('products');


export class ClientClass {
    constructor(document, document_data) {
        this.doc = document;
        this.name = document_data.name;
        this.cart = document_data.cart;
    }

    async addItem(item_id) {
        if (this.cart === null) {
            console.error('Cannot add item, something wrong with data');
            return;
        }

        // Add new item to the cart with quantity 1 or
        // increase by 1 if already exist
        if (!this.cart.hasOwnProperty(item_id))
            this.cart[item_id] = 0;
        this.cart[item_id]++;

        // Might need to update visually as well!
        await this.doc.update({cart: this.cart});
    };

    async changeItemQuantity(item_id, quantity) {
        if (this.cart === null) {
            console.error('Cannot remove item, something is wrong with data!');
            return;
        }

        if (!this.cart.hasOwnProperty(item_id)) {
            console.error(`User doesn't have the item in his cart! itemID - ${item_id}`);
            return;
        }

        if (quantity === 0) {
            await this.deleteItem(item_id);
            return;
        }

        let tcart = this.copyCart();
        tcart[item_id] = quantity;
        await this.doc.update({cart: tcart});
        this.cart[item_id] = quantity;
    }

    /**
     * remove item from the cart.
     * @param {Number} item_id
     * @returns {Promise<void>}
     */
    async deleteItem(item_id) {
        if (this.cart === null) {
            console.error('Cannot remove item, something is wrong with data!');
            return;
        }

        if (!this.cart.hasOwnProperty(item_id)) {
            console.error(`User doesn't have the item in his cart! itemID - ${item_id}`);
            return;
        }

        let tcart = this.copyCart();
        delete tcart[item_id];
        await this.doc.update({cart: tcart});
        delete this.cart[item_id];
    }

    async clearCart() {
        if (this.cart === {})
            return;
        await this.doc.update({cart: {}});
        this.cart = {};
    }

    copyCart() {
        let result = {};
        for (let i in this.cart) {
            result[i] = this.cart[i];
        }
        return result;
    }
}
