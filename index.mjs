// external modules
import inquirer from "inquirer";
import chalk from "chalk";

// internal modules
import fs from "fs";

operations();

function operations() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "O que você deseja fazer?",
      choices: ["Criar conta", "Consultar saldo", "Depositar", "Sacar", "Sair"],
    })
    .then((answer) => {
      const action = answer["action"];

      console.log(action);

      if (action === "Criar conta") {
        createAccount();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// create account
function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));

  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt({
      name: "accountName",
      message: "Digite um nome para sua conta:",
    })
    .then((answer) => {
      const accountName = answer["accountName"];

      console.info(accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black("Essa conta já existe, escolha outro nome")
        );
        buildAccount();
        return
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        (err) => {
          console.err(err);
        }
      );

      console.log(chalk.green("Parabéns, a sua conta foi criada!"));

      operations();
    })
    .catch((err) => {
      console.log(err);
    });
}
