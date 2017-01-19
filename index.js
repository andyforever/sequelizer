
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

    function handleSubmit(form) {
      const data = getFormData(form);

      data.tables = data.tables ? data.tables.split(',') : '';
      data.directory = data.directory || __dirname + '/models'
      data.camelCase = data.camelCase === 'on'

      $progressBar.style.display="block";
      $exportBtn.disabled = true;
      generate(data.database, data.username, data.password, data, function() {
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

    function onDialectChange(dialect) {
      $portInput.value = DIALECT_PORTS.find(x => x.dialect === dialect).port
    }