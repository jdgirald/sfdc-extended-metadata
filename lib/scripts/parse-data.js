'use strict';
const dirTree = require('directory-tree');
const metadata = require('../utils/metadata');
const ParserFactory = require('../factories/parser-factory.js');

module.exports = (inputFolder, outputFolder, options) => {
  if(typeof inputFolder === 'undefined' || inputFolder === null || typeof outputFolder === 'undefined' || outputFolder === null) {
    throw new Error('Not enough config options');
  }

  const promise = new Promise((resolve, reject) => {
    const parserFactory = new ParserFactory();
    Promise.all(
      dirTree(inputFolder)
      .children
      .filter(child => metadata[child.name] !== undefined && child.children != undefined && child.children.length > 0)
      .sort((a,b) => metadata[a.name].xmlName.localeCompare(metadata[b.name].xmlName))
      .map(elem => parserFactory.getParser(elem, inputFolder, outputFolder).build())
    ).then(result => {
      console.log('OK');
    }).catch(reject);
  });
}