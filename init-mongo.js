const connection = new Mongo();
let db = connection.getDB('admin');
db = db.getSiblingDB('hillel');

db.createUser({
  user: 'Sarhan',
  pwd: '1234',
  roles: [
    {
      role: 'readWrite',
      db: 'hillel',
    },
  ],
});
