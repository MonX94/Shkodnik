var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var fs = require('fs')

var url = 'mongodb://localhost:27017/website';

var data = MongoClient.connect(url) // It gets mongoDB data,
.then((db, err) => { assert.equal(null, err); return [db, err] }) // checks for errors,
.then(([db, err]) => {
	return [
	db.collection('goodslistBoys_0_1'),
	db.collection('goodslistBoys_2_5'),
	db.collection('goodslistBoys_6_9'),
	db.collection('goodslistBoys_10_15'),
	db]; // gets collections,
})
.then(([collection1, collection2, collection3, collection4, db]) => collection1.find({}).toArray() //passes toArray on one of them
.then(docs1 => [docs1, collection2, collection3, collection4, db]))
.then(([docs1, collection2, collection3, collection4, db]) => collection2.find({}).toArray() //passes toArray on another of them
.then(docs2 => [docs2, docs1, collection3, collection4, db]))
.then(([docs2, docs1, collection3, collection4, db]) => collection3.find({}).toArray() //passes toArray on one more of them
.then(docs3 => [docs3, docs1, docs2, collection4, db]))
.then(([docs3, docs1, docs2, collection4, db]) => collection4.find({}).toArray() //passes toArray on last of them
.then(docs4 => [docs4, docs1, docs2, docs3, db]))
.then(([docs4, docs1, docs2, docs3, db]) => {
	db.close()
	return [docs1, docs2, docs3, docs4];
})
.then((docs) => {
	var toWrite = 'module.exports = ' + JSON.stringify(docs);
	fs.writeFile('content_boys.js', toWrite, () => {})
})
.catch ((err) => {
	console.error('There is error in promise:')
	throw err
})