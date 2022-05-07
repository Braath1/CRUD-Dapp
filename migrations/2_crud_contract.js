const crudContract = artifacts.require("Crud");

module.exports = function(deployer) {
  deployer.deploy(crudContract);
};
