const FerramentaController = require('./js/controller/FerramentaController.js');
const ServicosController = require('./js/controller/ServicosController.js');
const EstatisticaController = require('./js/controller/EstatisticaController.js');
const { ipcRenderer } = require('electron');
const fs = require('fs');

let $ = document.querySelector.bind(document);
let cnpjModel;

window.onload = function () {

    console.log("Carregando aplicação!!!");

    //Materialize.toast('Lista Atualizada!', 3000);

    let emissaoValor = 1;

    let conteudo = "showEmployees";
    FerramentaController._ativarGerador();
    FerramentaController._iniciaConfig();

    $('#btnGerador').onclick = function (event) {
        event.preventDefault();
        FerramentaController._ativarGerador();
    };

    $('#btnEstatisticas').onclick = function (event) {
        event.preventDefault();
        FerramentaController._ativarEstatisticas();
    };

    $('#btnServicos').onclick = function (event) {
        event.preventDefault();
        FerramentaController._ativarServicos();
    };

    $('#btnGerarNovaSerie').onclick = function (event) {
        event.preventDefault();
        $('#serie').value = Math.floor(Math.random() * 900) + 1;
        $('#lblSerie').classList.add('active');
    };

    $('#arquivo').onchange = function (event) {
        let caminho = null;
        try {
            caminho = document.getElementById("arquivo").files[0].path;
            FerramentaController._arquivoBase(caminho);
            //grava arquivo vindo do campo #arquivo
            FerramentaController._salvarOrigem();
        } catch (Exception) {
            throw (Exception);
        }
    };

    $('#btnModal').onclick = function (event) {
        event.preventDefault();
        ipcRenderer.send('ModalArquivo');
    };

    $('#btnCadastrarCnpj').onclick = function (event) {
        event.preventDefault();
        ipcRenderer.send('ModalCnpj');
    };

    $('#showEmployees').onclick = function (event) {
        event.preventDefault();
        ipcRenderer.send('ModalEmployees');
    };

    $('#agentes').onchange = event => $('#lblAgentes').innerHTML = 'Quantidade de Agentes: ' + $('#agentes').value;

    $('#CNPJ').onchange = event => { 
        FerramentaController._salvarDados();
        FerramentaController._registraIe($('#CNPJ').value);
    }
    
    $('#btnLimpaFormulario').onclick = function (event) {
        event.preventDefault();
        document.getElementById("painelGerador").reset();
    };

    $('#nomenclatura').oninput = (event) => {
        //regra
        if (conteudo == $('#nomenclatura').value) {
            $('#menuTopo').style.right = '-130px';
            $('#showEmployees').innerHTML = '<a class="btn-floating btnMenu amber accent-4"><i class="material-icons">people</i></a>';
        }
        else {
            $('#menuTopo').style.right = '-186px';
        }
    };

    $('#gerarNotas').onclick = function (event) {
        let verificaValidacao = FerramentaController._validaFormulario();
        if (verificaValidacao == true) {
            //Chama o método para gerar Notas
            FerramentaController._gerarNotas();
        } 

        event.preventDefault();
    }

    //Estatistica .Exception

    $('#gerarEstatistica').onclick = function (event) {
        try {
            let qtdItens = $("#arquivosException").files.length;
            EstatisticaController.leArquivos(qtdItens).then(() => {
                //promisse sem implementação
            },(error) => {console.log(`Erro: ${error}`);});   
        } catch (Exception) {
            console.log("Erro: " + Exception);
        }

        event.preventDefault();
    }

    //Gerenciador de Serviços

    $('#agente').onchange = function (event) {
        $("#contadorAgente").disabled = false;
        $('#destinoArquivos').disabled = false;
        $('#arquivosAgente').disabled = false; 
        $('#limparAgente').disabled = false;
        event.preventDefault();
    }

    $('#qtdAgenteServico').onchange = event => $('#lblAgente').innerHTML = 'Quantidade de Agentes: ' + parseInt($("#contadorAgente").value);    

    $('#concentrador').onchange = function (event) {
        $("#contadorAgente").disabled = true;
        $('#arquivosAgente').disabled = true;
        $('#destinoArquivos').disabled = true;
        $('#limparAgente').disabled = true;
        event.preventDefault();
    }

    $('#pararServico').onclick = function (event) {
        if ($("#agente").checked == true) {
            let quantidade = parseInt($("#contadorAgente").value);
            let tipo = 1;
            ServicosController.paraServicos(quantidade, 'NDDigitalAgentService_', tipo).then(() => {
                //promisse sem implementação
            },(error) => {console.log(`${error}`);});        
        } else {
            let quantidade = 1;
            let tipo = 2;
            ServicosController.paraServicos(quantidade, 'NDDigitalConcentratorService', tipo).then(() => {
                 //promisse sem implementação               
            },(error) => {console.log(`${error}`);});        
        }
        event.preventDefault();
    }

    $('#iniciarServico').onclick = function (event) {
        if ($("#agente").checked == true) {
            let quantidade = parseInt($("#contadorAgente").value);
            let tipo = 1;
            ServicosController.iniciaServicos(quantidade, 'NDDigitalAgentService_', tipo).then(() => {
                //promisse sem implementação
            },(error) => {console.log(`${error}`);});        
        } else {
            let quantidade = 1;
            let tipo = 2;
            ServicosController.iniciaServicos(quantidade, 'NDDigitalConcentratorService', tipo).then(() => {
                 //promisse sem implementação               
            },(error) => {console.log(`${error}`);});        
        }
        event.preventDefault();
    }

    $('#limparAgente').onclick = function (event) {
        if ($("#agente").checked == true) {
            let quantidade = parseInt($("#contadorAgente").value);
            let tipo = 1;
            ServicosController.paraServicos(quantidade, 'NDDigitalAgentService_', tipo).then(() => {
                let caminho = $('#destinoArquivos').value;
                let base =  $('#arquivosAgente').value;
                ServicosController.alteraArquivos(quantidade, caminho, base);    
            },(error) => {console.log(`${error}`);});        
        } else {
            let quantidade = 1;
            let tipo = 2;
            ServicosController.paraServicos(quantidade, 'NDDigitalConcentratorService', tipo).then(() => {
                //Concentrador não terá remove arquivos
            },(error) => {console.log(`${error}`);});        
        }
        event.preventDefault();
    }
};