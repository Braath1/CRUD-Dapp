pragma solidity ^0.5.0;

contract Crud {
    // This is a type decleration, not an instance of the struct
    struct User {
        uint id;
        string name;
    }
    // Create an array of users from the User struct
    User[] public users;
    // Holds the value of the next user created
    // To avoid empty string when deleting a user, 
    // use nextId = 1 so it will revert and no user with id of 0
    uint public nextId = 1;
    // Create a new user
    function create(string memory name) public {
        // Push new users into User array with id and name
        users.push(User(nextId, name));
        // Increase nextId by one to avoid overwrite of current id
        nextId++;
    }
    // In Solidity a function can return several values, id and name
    function read(uint id) view public returns(uint, string memory) {
        // Call the find function
        uint i = find(id);
        return(users[i].id, users[i].name);    
    }

    function update(uint id, string memory name) public {
        uint i = find(id);
        // When we find the right user from the struct
        // We access the name field and asign it to the name parameter
        users[i].name = name;
    }
    // Delete is a reserved keyword, so not allowed
    function destroy(uint id) public {
        // Find the user
        uint i = find(id);
        // Delete the user
        delete users[i];
    }

    function find(uint id) view internal returns(uint) {
       for(uint i = 0; i < users.length; i++) {
            // Find if this is the right user
            if (users[i].id == id) {
                // When we find the right user from the struct
                // We access the name field and asign it to the name parameter
                return i;
            }
        }
        // Revert if user not found
        revert('User does not exist');
    }
}
