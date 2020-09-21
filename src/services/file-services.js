export default {

    KEY_NAME: 'filepaths',

    getFiles() {
        if (localStorage.getItem(this.KEY_NAME) === null) {
            localStorage.setItem(this.KEY_NAME, JSON.stringify([]))
        }
        return JSON.parse(localStorage.getItem(this.KEY_NAME));
    },

    addFile(filepath) {
        let files = this.getFiles();
        files.push(filepath);
        localStorage.setItem(this.KEY_NAME, JSON.stringify(files));
    },

    removeFile(index) {
        let files = this.getFiles();
        files.splice(index, 1);
        localStorage.setItem(this.KEY_NAME, JSON.stringify(files));
    }

}
