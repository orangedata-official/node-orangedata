<div align="center">Node.js integration for OrangeData service</div>


###  

> Note: this project is released with a [Contributor Code of Conduct](https://github.com/0777101/node-orangedata/blob/master/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

<div align="right">
  <sub>
    - made with ❤︎ by <a href="http://orangedata.ru/">OrangeData</a> and <a href="https://github.com/0777101/node-orangedata/graphs/contributors">contributors</a>.
  </sub>
</div>

# Возможности
- [x] Взаимодействие с онлайн-кассой по защищенному каналу связи (SSL)
- [x] SHA256-RSA подпись сообщений приватным ключом отправителя
- [x] Создания чека, соответствующего [протоколу](https://github.com/orangedata-official/API) ОранджДата
- [x] Получение статуса ранее отправленного чека
- [ ] Создание чека коррекции

# Установка

Для работы с данной библиотекой требуется Node.js версии [8.9.2 (LTS)](https://nodejs.org/en/) или выше.

Используя [yarn](https://yarnpkg.com):

    $ yarn add node-orangedata

Используя [npm](https://www.npmjs.com):

    $ npm install --save node-orangedata

# Использование
Используйте команду `node examples`, чтобы запустить выполнение [примера](./examples/index.js) в вашей консоли.

1. Подключите библиотеку в вашем коде:

    ```javascript
    const { OrangeData, Order } = require('node-orangedata');
    ```

1. Передайте параметры для установления защищенного соединения в конструктор класса `OrangeData`:

    ```javascript

    const cert = fs.readFileSync('./keys/client.crt');
    const key = fs.readFileSync('./keys/client.key');
    const passphrase = '1234';
    const ca = fs.readFileSync('./keys/cacert.pem');
    const privateKey = fs.readFileSync('./keys/private_key.pem');
    const apiUrl = 'https://apip.orangedata.ru:2443/api/v2';

    const agent = new OrangeData({ apiUrl, cert, key, passphrase, ca, privateKey });
    ```

1. Создайте экземпляр класса `Order` и заполните документ данными соответствующими [протоколу](https://github.com/orangedata-official/API):

    ```javascript
    const order = new Order({
      id: '123',
      inn: '7725713770',
      group: 'Main',
      type: 1, // Приход
      customerContact: '+79991234567',
      taxationSystem: 1, // Общая
    });

    order
      .addPosition({
        text: 'Тестовый товар',
        quantity: 5,
        price: 10,
        tax: 1,
        paymentMethodType: 1,
        paymentSubjectType: 1,
        nomenclatureCode: 'igQVAAADMTIzNDU2Nzg5MDEyMwAAAQ==',
      })
      .addPayment({ type: 1, amount: 10 })
      .addPayment({ type: 2, amount: 40 })
      .addAgent({
        agentType: 127,
        paymentTransferOperatorPhoneNumbers: ['+79998887766'],
        paymentAgentOperation: 'Операция агента',
        paymentAgentPhoneNumbers: ['+79998887766'],
        paymentOperatorPhoneNumbers: ['+79998887766'],
        paymentOperatorName: 'Наименование оператора перевода',
        paymentOperatorAddress: 'Адрес оператора перевода',
        paymentOperatorINN: '3123011520',
        supplierPhoneNumbers: ['+79998887766'],
      })
      .addUserAttribute({
        name: 'citation',
        value: 'В здоровом теле здоровый дух, этот лозунг еще не потух!',
      });

    ```

1. Используйте агента, чтобы отправить сформированный документ:

    ```javascript
    const { OrangeDataError } = require('node-orangedata/lib/errors');

    try {
      agent.sendOrder(order);
    } catch (error) {
      if (error instanceof OrangeDataError) {
        // OrangeData errors contains additional info in `errors` property of type Array
        console.log(error.message, error.errors);
      }
      // general errors handling
    }

    ```

1. Используйте агента для получения статусов по ранее отправленным документам:

    ```javascript
    try {
      const status = agent.getOrderStatus(inn, id);
      if (status) {
        // Документ успешно обработан, status содержит данные документа
      } else {
        // Документ создан и добавлен в очередь на обработку, но еще не обработан
      }
    } catch (error) {
      if (error instanceof OrangeDataError) {
        // OrangeData errors contains additional info in `errors` property of type Array
        console.log(error.message, error.errors);
      }
      // general errors handling
    }

    ```

# Troubleshooting

* Ошибка `error:0D0680A8:asn1 encoding routines:ASN1_CHECK_TLEN:wrong tag` означает неправильный pem формат приватного ключа.

  Если вы воспользовались советом из протокола и сконвертировали xml в pem с помощью [онлайн-конвертора](https://superdry.apphb.com/tools/online-rsa-key-converter), то попробуйте изменить заголовок и окончание ключа.
  Укажите `-----BEGIN PRIVATE KEY-----` вместо `-----BEGIN RSA PRIVATE KEY-----`.

# License

This project is licensed under the MIT license, copyright (c) 2017 АО "Оранж Дата".
