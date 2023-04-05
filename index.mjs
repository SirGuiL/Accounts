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
      } else if (action === "Consultar saldo") {
        getAccountBalance();
      } else if (action === "Depositar") {
        deposit();
      } else if (action === "Sacar") {
        withdraw();
      } else {
        console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"));
        process.exit();
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
        return;
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

// add an amount to user account
function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccountExists(accountName)) {
        return deposit();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja depositar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          addAmount(accountName, amount);

          operations();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {});
}

// verify if accounts exists
function checkAccountExists(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black("Essa conta não existe, tente novamente."));
    return false;
  }

  return true;
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde")
    );
    return deposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => console.log(err)
  );

  console.log(chalk.green(`Foi depositado o valor de R$${amount}`));
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(accountJSON);
}

// show account balance
function getAccountBalance() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      // verify if account exists
      if (!checkAccountExists(accountName)) {
        return getAccountBalance();
      }

      const accountData = getAccount(accountName);

      console.log(
        chalk.bgBlue.white.bold(
          `Olá, ${accountName}! O saldo da sua conta é de R$${accountData.balance}.`
        )
      );

      operations();
    })
    .catch((err) => console.error(err));
}

// withdraw an amount from user account
function withdraw() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!checkAccountExists(accountName)) {
        return withdraw();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja sacar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          console.log(amount);

          operations();
        })
        .catch((err) => console.error(err));
    })
    .catch((err) => console.error(err));
}
