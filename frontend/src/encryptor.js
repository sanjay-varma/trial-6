import jsencrypt from "jsencrypt";

export default class encryptor {
    constructor(publicKey) {
        this.jsenc = new jsencrypt();
        this.jsenc.setPublicKey(publicKey);
    }

    encrypt = (data) => {
        var cipher = this.jsenc.encrypt(data);
        return cipher.toString('base64');
    }
}