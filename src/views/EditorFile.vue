<template>
  <div class="home">
    <div class="bar">
      <v-btn :color="text !== last_save ? 'deep-purple accent-2' : ''" class="mr-2" small :disabled="text.length === 0" icon v-on:click="save">
        <v-icon small>mdi-content-save</v-icon>
      </v-btn>
      <v-btn-toggle
          mandatory
          borderless
          rounded
          dense
          v-model="toggle_one"
      >
        <v-btn small>
          <v-icon small>mdi-view-headline</v-icon>
        </v-btn>
        <v-btn small>
          <v-icon small>mdi-view-split-vertical</v-icon>
        </v-btn>
        <v-btn small>
          <v-icon small>mdi-square</v-icon>
        </v-btn>
      </v-btn-toggle>
      <div v-if="toggle_one === 0 || toggle_one === 1">
        <v-btn :color="isBold ? 'deep-purple accent-2': ''" icon small @click="getSel('**')">
          <v-icon small>mdi-format-bold</v-icon>
        </v-btn>
        <v-btn icon small @click="getSel('*')">
          <v-icon small>mdi-format-italic</v-icon>
        </v-btn>
        <v-btn icon small @click="getSel(`~~`)">
          <v-icon small>mdi-format-strikethrough</v-icon>
        </v-btn>
      </div>
    </div>
    <div id="editmode">
      <div v-if="toggle_one === 0 || toggle_one === 1" style="width: 100%">
        <h2>Éditeur</h2>
        <v-textarea
            id="area"
            rows="10"
            auto-grow
            no-resize
            color="dark"
            :loading="loader"
            outlined
            v-model="text"></v-textarea>
      </div>
      <div v-if="toggle_one === 1 || toggle_one === 2" id="preview">
        <h2>Rendu</h2>
        <hr>
        <Editor
            :render-config="renderConfig"
            mode="viewer"
            v-model="text"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {Editor} from "vuetify-markdown-editor";

export default {
  name: "EditorFile",
  props: {
    filepath: String
  },
  components:{
    Editor
  },
  data: () => ({
    toggle_one: 1,
    text: '',
    defaultPath: '',
    loader: false,
    dialog: false,
    isBold: false,
    last_save: '',
    renderConfig: {
      codeCopy: undefined
    }
  }),
  methods: {
    checkText() {
      const txtarea = document.getElementById("area");
      const result = /\S+$/.exec(this.text.slice(0, this.text.indexOf(' ',txtarea.selectionEnd)));
      console.log(result.toString())
      if(result.toString().startsWith('**')) {
        this.isBold = true;
      }else{
        this.isBold = false;
      }
    },
    getSel(addText) {
      const txtarea = document.getElementById("area");
      if (txtarea.selectionStart !== txtarea.selectionEnd) {

        const start = txtarea.selectionStart;
        const finish = txtarea.selectionEnd;
        const sel = this.text.substring(start, finish);
        this.text = this.text.substring(0, start)+addText+sel+addText+this.text.substring(finish, this.text.length);
      }
    },
    save() {
      const remote = window.require('electron').remote;
      const fs = remote.require('fs');

      if(!this.defaultPath) {
        const options = {
          title: "Save file",
          defaultPath : this.text.substr(0, 5),
          buttonLabel : "Enregistrer",

          filters :[
            {name: 'md', extensions: ['md',]}
          ]
        }

        remote.dialog.showSaveDialog( remote.getCurrentWindow(), options).then((data) => {
          fs.writeFileSync(data.filePath, this.text, 'utf-8');
          this.defaultPath = data.filePath;
          this.$emit('save', this.defaultPath);
        })
      }else {
        fs.writeFileSync(this.defaultPath, this.text, 'utf-8');
      }
      this.last_save = this.text;
    },
  },
  created() {
    console.log(this.filepath)
    this.defaultPath = this.filepath
    const remote = window.require('electron').remote;
    const fs = remote.require('fs');
    if(this.defaultPath) {
      fs.readFile(this.defaultPath, 'utf-8', (err, data) => {
        if(err){
          alert("An error ocurred reading the file :" + err.message);
          return;
        }

        this.text = data;
        this.last_save = data;
      });
    }
  }
}
</script>

<style scoped>
  #editmode {
    width: 90%;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: baseline;
  }

  #preview{
    width: 100%;
    padding: 15px;
    position: -webkit-sticky;
    position: sticky;
    bottom: 0;
  }

  .bar {
    display: flex;
  }

</style>
