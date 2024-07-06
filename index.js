const getRawBody = require('raw-body');
const { getCurrency, addCurrency } = require('./currency-api');

exports.handler = (req, resp, context) => {
  let statusCode = 200;
  let headers = { 'Content-Type': 'application/json' };
  let responseBody = '';

  const sendResponse = () => {
    resp.setStatusCode(statusCode);
    for (const header in headers) {
      resp.setHeader(header, headers[header]);
    }
    resp.send(responseBody);
  };

  switch (req.method) {
    case 'GET':
      if (req.path.match(/\/([^/]+)\/([^/]+)/)) {
        const [, id, symbol] = req.path.match(/\/([^/]+)\/([^/]+)/);
        const currency = getCurrency(id);
        if (currency && currency.symbol === symbol) {
          responseBody = JSON.stringify({ name: currency.name, symbol: currency.symbol, description: currency.description }, null, ' ');
        } else {
          statusCode = 404;
          responseBody = JSON.stringify({ error: "Currency not found" });
        }
      } else if (req.path.match(/\/([^/]+)/)) {
        const [, symbol] = req.path.match(/\/([^/]+)/);
        const currency = getCurrency(symbol);
        if (currency) {
          responseBody = JSON.stringify({ rate: currency.rate }, null, ' ');
        } else {
          statusCode = 404;
          responseBody = JSON.stringify({ error: "Currency not found" });
        }
      } else if (req.path.match(/\/([^/]+)\/([^/]+)/)) {
        const [, symbol, amount] = req.path.match(/\/([^/]+)\/([^/]+)/);
        const currency = getCurrency(symbol);
        if (currency) {
          const exchange = Number(amount) * currency.rate;
          responseBody = JSON.stringify({ exchange }, null, ' ');
        } else {
          statusCode = 404;
          responseBody = JSON.stringify({ error: "Currency not found" });
        }
      } else {
        statusCode = 404;
        responseBody = JSON.stringify({ error: "Endpoint not found" });
      }
      sendResponse();
      break;

    case 'POST':
      if (req.path === '/currency') {
        getRawBody(req).then(bodyContent => {
          try {
            const { id, name, symbol, rate, description } = JSON.parse(bodyContent.toString());
            addCurrency(id, name, symbol, rate, description);
            responseBody = JSON.stringify({ status: "201", description: "New currency added." }, null, ' ');
            sendResponse();
          } catch (error) {
            statusCode = 501;
            responseBody = JSON.stringify({ status: "501", description: "New currency failed to add." });
            sendResponse();
          }
        }).catch(err => {
          statusCode = 400;
          responseBody = JSON.stringify({ status: "400", description: "Error reading request body" });
          sendResponse();
        });
      } else {
        statusCode = 404;
        responseBody = JSON.stringify({ error: "Endpoint not found" });
        sendResponse();
      }
      break;

    default:
      statusCode = 404;
      responseBody = JSON.stringify({ error: "Endpoint not found" });
      sendResponse();
  }
};