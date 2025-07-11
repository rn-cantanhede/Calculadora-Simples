// Seleciona o elemento HTML que irá exibir o resultado das operações
const resultado = document.querySelector(".Calculos h1");

// Seleciona todos os botões numéricos na interface
const botoes = document.querySelectorAll(".digitos button");

// Variáveis para controlar o estado da calculadora
let AtualNumero = "";        // Número atual que o usuário está digitando
let PrimeiroOperando = null; // Primeiro número da operação (antes de clicar em um operador)
let operador = null;         // Armazena o operador matemático (+, -, x, ÷)
let limpar = false;          // Controla se o próximo dígito deve substituir o número atual (para evitar adicionar outro número sem querer)

// Adiciona um ouvinte de evento para cada botão de número ou operador
botoes.forEach((button) => {
    button.addEventListener("click", () => {
        // Obtém o texto do botão clicado (o valor que o botão representa)
        const buttonText = button.innerText;

        // Se o texto do botão for um número ou vírgula, adicionamos ao número atual
        if (/^[0-9,]+$/.test(buttonText)) {
            AdicionarDigito(buttonText);
        } else if (["+", "-", "X", "/"].includes(buttonText)) {
            // Se for um operador, definimos o operador e possivelmente calculamos antes
            SetOperadores(buttonText);
        } else if (buttonText === "=") {
            // Se for o botão de igual, calculamos o resultado
            Calcular();
        } else if (buttonText === "C") {
            // Se for o botão de limpar, limpamos a calculadora
            LimparCalculadora();
        } else if (buttonText === "±") {
            // Se for o botão de alternar sinal, alteramos o sinal do número atual
            AtualNumero = (
                parseFloat(AtualNumero || PrimeiroOperando) * -1).toString();
            AtualizarResultado();
        } else if (buttonText === "%") {
            // Se for o botão de porcentagem, calculamos o valor porcentual
            SetPorcentagem();
        }
    });
});

// Função para atualizar o visor da calculadora
function AtualizarResultado(LimparOrigem = false) {
    if (LimparOrigem) {
        // Se for para limpar o visor, mostramos "0"
        resultado.innerText = 0;
    } else {
        // Senão, mostramos o número atual, substituindo o ponto por vírgula
        resultado.innerText = AtualNumero.replace(".", ",");
    }
}

// Função para adicionar um dígito ao número atual
function AdicionarDigito(digito){
    // Impede a adição de múltiplas vírgulas ou a vírgula no início
    if (digito === "," && (AtualNumero.includes(",") || !AtualNumero)) return;

    // Se for para limpar, substituímos o número atual com o novo dígito
    if (limpar) {
        AtualNumero = digito;
        limpar = false; // Após limpar, não queremos mais que a próxima ação limpe
    } else {
        // Senão, apenas adicionamos o dígito ao número atual
        AtualNumero += digito;
    }

    // Atualizamos o visor com o número modificado
    AtualizarResultado();
}

// Função para limpar a calculadora e reiniciar os valores
function LimparCalculadora(){
    // Reinicia todos os valores
    AtualNumero = "";
    PrimeiroOperando = null;
    operador = null;
    
    // Atualiza o visor para exibir 0
    AtualizarResultado(true);
}

// Função para configurar o operador (+, -, X, /) e iniciar a operação
function SetOperadores(newOperador){
    if (AtualNumero) {
        // Se já houver um número digitado, fazemos o cálculo com o número atual
        Calcular();

        // Armazenamos o primeiro operando (número antes do operador)
        PrimeiroOperando = parseFloat(AtualNumero.replace(",", "."));
        // Limpamos o número atual, pois agora o usuário vai digitar o próximo número
        AtualNumero = "";
    }

    // Definimos o operador selecionado (+, -, X, /)
    operador = newOperador;
}

// Função para calcular a porcentagem do número atual
function SetPorcentagem() {
    // Calcula o valor em porcentagem
    let resultado = parseFloat(AtualNumero) / 100;

    // Se a operação atual for uma soma ou subtração, calculamos o valor porcentual em relação ao primeiro operando
    if (["+", "-"].includes(operador)) {
        resultado = resultado * (PrimeiroOperando || 1);
    }

    // Limita o número de casas decimais do resultado a 4, caso necessário
    if (resultado.toString().split(".")[1]?.length > 4) {
        resultado = resultado.toFixed(5).toString();
    }

    // Atualiza o número atual e o visor com o resultado da porcentagem
    AtualNumero = resultado.toString();
    AtualizarResultado();
}

// Função para realizar o cálculo com base nos operandos e operador
function Calcular(){
    // Se não houver operador ou primeiro operando, não faz sentido calcular
    if (operador === null || PrimeiroOperando === null) return;

    // Converte o número atual para o segundo operando
    let SegundoOperando = parseFloat(AtualNumero.replace(",", "."));
    let ResultadorValor;

    // Realiza a operação matemática de acordo com o operador selecionado
    switch (operador) {
        case "+":
            ResultadorValor = PrimeiroOperando + SegundoOperando;
            break;

        case "-":
            ResultadorValor = PrimeiroOperando - SegundoOperando;
            break;

        case "X":
            ResultadorValor = PrimeiroOperando * SegundoOperando;
            break;

        case "/":
            ResultadorValor = PrimeiroOperando / SegundoOperando;
            break;
        default:
            break;
        
        return;
    }

    // Limita o número de casas decimais do resultado a 4, caso necessário
    if (ResultadorValor.toString().split(".")[1]?.length > 4) {
        AtualNumero = parseFloat(ResultadorValor.toFixed(4)).toString();
    } else {
        AtualNumero = ResultadorValor.toString();
    }

    // Após o cálculo, reiniciamos o operador e o primeiro operando para o próximo cálculo
    operador = null;
    PrimeiroOperando = null;
    
    // Atualizamos o visor com o resultado
    AtualizarResultado();
}
