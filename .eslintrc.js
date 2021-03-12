/* I prefer to use JavaScript file because i can write comment and other can understand it.
if you wish to use .eslintrc without js extension,then you need to remove all the comments and
its looks just like { ..eslint config as below} without module.export 
*/

module.exports={
  "root": true,
  "parser": "@typescript-eslint/parser", // we are changing default parser
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "project": "./tsconfig.json" // path to tsconfig
  },

/* A plugin provides you with a set of rules that you can 
individually apply depending on your need.
Just having a plugin does not enforce any rule.
You have to choose which rules you need. 
A plugin may provide you with zero, one, or more configuration files.
If the plugin provides a configuration file, then you can load
that in your extends section after adding the plugin in the plugins section.
*/
  "plugins": ["@typescript-eslint"], 

/* extends uses a config file which applies set of rules 
when you add that to the extends options. */
 "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  "rules": {
  },
  "overrides": [
  ]
}

