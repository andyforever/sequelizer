
    const DB_CONFIG = 'DB_CONFIG'

    const generate = require('./generate')
    const {dialog} = require('electron').remote;

    const $progressBar = document.getElementById('progressBar');
    const $exportBtn = document.getElementById('exportBtn');
    const $directoryInput = document.getElementById('directory');
    const $portInput = document.getElementById('port');

    const DIALECT_PORTS = [
      { dialect:'mssql',    port:1433 },
      { dialect:'mysql',    port:3306 },
      { dialect:'mariadb',  port:3306 },
      { dialect:'postgres', port:5432 },
      { dialect:'sqlite',   port:null }
    ]

    init();

    /**
     * form input initial value process
     * @return
     */
    function init() {
      let cacheConfig = localStorage.getItem(DB_CONFIG);
      if (cacheConfig) {
        try{
          cacheConfig = JSON.parse(cacheConfig);
          setFormData(cacheConfig);
        } catch(e) {
          console.log(e)
        }
      }
    }

    function handleSubmit(form) {
      const config = getFormData(form);

      config.tables = config.tables ? config.tables.split(',') : '';
      config.directory = config.directory || __dirname + '/models'
      config.camelCase = config.camelCase === 'on'
      config.typescript = config.typescript === 'on'

      $progressBar.style.display="block";
      $exportBtn.disabled = true;
      generate(config, function() {
        //set the configration to the localStorage when success
        localStorage.setItem(DB_CONFIG, JSON.stringify(config));
        $progressBar.style.display="none";
        $exportBtn.disabled = false;
      })
    }

    function openFileDialog() {
      dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']}, function(filePaths) {
        if (filePaths) {
          $directoryInput.value = filePaths[0];
        }
      })
    }

    function getFormData(form) {
      const data = {};
      const inputs = form.getElementsByTagName('input')

      for (let i = 0; i < inputs.length; i++) {
        if(inputs[i].type == 'text' || inputs[i].type == 'password') {
          data[inputs[i].name] = inputs[i].value
        } else if (inputs[i].type == 'radio' || inputs[i].type == 'checkbox') {
          if (inputs[i].checked) {
            data[inputs[i].name] = inputs[i].value;
          }
        }
      }

      return data;
    }

    function setFormData(data) {
      const form = document.getElementsByTagName('form')[0];
      const inputs = form.getElementsByTagName('input');
      for (let i = 0; i < inputs.length; i++) {
        if(inputs[i].type == 'text' || inputs[i].type == 'password') {
          inputs[i].value = data[inputs[i].name]
        } else if (inputs[i].type == 'radio' || inputs[i].type == 'checkbox') {
          if (data[inputs[i].name] == inputs[i].value) {
            inputs[i].checked = true;
          }
        }
      }
    }

    function onDialectChange(dialect) {
      $portInput.value = DIALECT_PORTS.find(x => x.dialect === dialect).port
    }