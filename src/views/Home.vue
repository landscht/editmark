<template>
  <div class="home" style="margin-top: -30px">
    <v-btn small icon v-on:click="newFile">
      <v-icon small>mdi-plus</v-icon>
    </v-btn>
    <v-btn small icon v-on:click="openFile">
      <v-icon small>mdi-folder-open</v-icon>
    </v-btn>
    <v-tabs
        height="40"
        background-color="deep-purple accent-4"
        center-active
        color="white"
        dark
        v-model="tabs"
    >
      <v-tab v-if="files.length === 0">Sans titre</v-tab>
      <v-tab v-else v-for="(file, i) in files" :key="i" v-on:click="current_file = file.filepath">
        {{file.title}}
        <v-btn icon x-small v-if="tabs === i" @click="closeFile(i)">
          <v-icon x-small>mdi-close</v-icon>
        </v-btn>
      </v-tab>
    </v-tabs>
    <v-tabs-items class="pt-3" v-model="tabs">
      <v-tab-item v-if="files.length === 0">
        <EditorFile v-on:save="saveNewFile"></EditorFile>
      </v-tab-item>
      <v-tab-item
          v-else
          v-for="file in files"
          :key="file.title"
      >
        <EditorFile v-on:save="saveNewFile" :filepath="file.filepath"></EditorFile>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog
        v-model="dialog"
        max-width="1000"
    >
      <DialogMd></DialogMd>
    </v-dialog>
    <v-footer fixed height="30">
      <span class="font-weight-light caption">{{current_file}}</span>
      <v-spacer></v-spacer>
      <v-btn :color="this.$vuetify.theme.dark ? 'deep-purple accent-2' : ''" icon x-small @click="changeTheme"><v-icon>mdi-compare</v-icon></v-btn>
      <v-btn text x-small v-on:click="dialog = !dialog">
        md
      </v-btn>
    </v-footer>
  </div>
</template>

<script>
import EditorFile from "@/views/EditorFile";
import FileService from '@/services/file-services';
import DialogMd from "@/views/DialogMd";

export default {
  name: 'Home',
  components:{
    DialogMd,
    EditorFile,
  },
  data: () => ({
    files: [],
    tabs: '',
    dialog: false,
    cptNewFile: 0,
    current_file: ''
  }),
  created() {
    FileService.getFiles().forEach((file) => {
      this.files.push({
        title: file.split('/').reverse()[0],
        filepath: file
      });
    });
    this.current_file = this.files[0].filepath
    console.log(this.files);
  },
  methods: {
    closeFile(index) {
      console.log(index);
      this.files.splice(index, 1);
      FileService.removeFile(index);
    },
    saveNewFile(event) {
      this.files[this.tabs] = {
        title: event.split('/').reverse()[0],
        filepath: event
      }
      FileService.addFile(event);
    },
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem('darkmode', this.$vuetify.theme.dark + '');
    },
    newFile() {
      this.files.push({
        title: 'Sans titre ' + this.cptNewFile,
        filepath: null
      })
      this.cptNewFile++;
      this.tabs = this.files.length -1;
    },
    openFile() {
      const remote = window.require('electron').remote;

      remote.dialog.showOpenDialog({
        properties: [
          'openFile', (fileNames) => {
            console.log(fileNames);
          }
        ]
      }).then((data) => {

        this.files.push({
          title: data.filePaths[0].split('/').reverse()[0],
          filepath: data.filePaths[0]
        })
        console.log('coucou')
        FileService.addFile(data.filePaths[0]);
        this.tabs = this.files.length-1;
        console.log(this.files);
      });
    },
  }
}
</script>

<style lang="scss">

</style>
