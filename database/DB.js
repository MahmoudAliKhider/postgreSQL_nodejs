const pg = require("pg");
const { faker } = require("@faker-js/faker");

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: process.env.PGDATABASE,
  password: 12345,
  port: 5432,
});

faker.seed(1000);
let product = [];

for (let i = 0; i < 20; i++) {
  let title = faker.commerce.product();
  let description = faker.commerce.productDescription();
  for (let i = 0; i < 2; i++) {
    var sizes = faker.helpers.arrayElement(["{M , L}", "{L , XL}", "{XL, L}"]);
    var colors = faker.helpers.arrayElement([
      "{Red , Yellow}",
      "{Blue , White}",
      "{Red, Green, Black}",
    ]);
  }
  let ob = {
    title: title,
    description: description,
    sizes: sizes,
    colors: colors,
  };
  product.push(ob);
}

let preparedStatememnt = (data) => {
  const statement = `INSERT INTO products(title,description,sizes,colors) VALUES `;

  let values = "";

  let row = {};

  for (let i = 0; i < data.length - 1; i++) {
    row = data[i];
    row.title = row.title.replace("'", "''");
    row.description = row.description.replace("'", "''");
    row.sizes = row.sizes.toString().replace("'", "''");
    row.colors = row.colors.toString().replace("'", "''");
    let value = `(\'${row.title}\',\'${row.description}\',\'${row.sizes}',\'${row.colors}')`;
    value += ", ";
    values += value;
  }
  // adding the last row now:
  row = data[data.length - 1];
  row.title = row.title.replace("'", "''");
  row.description = row.description.replace("'", "''");
  row.sizes = row.sizes.toString().replace("'", "''");
  row.colors = row.colors.toString().replace("'", "''");
  values += `(\'${row.title}\',\'${row.description}\',\'${row.sizes}',\'${row.colors}')`;
  values += ";";
  return { statement, values };
};
let ob = preparedStatememnt(product);

console.log("Query statement is constructed...");
// console.log(ob.statement + ob.values);

pool
  .connect()
  .then((client) => {
    console.log("Connected to DB...");
    client.query(ob.statement + ob.values);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = pool;
