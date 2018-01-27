pragma solidity ^0.4.13;

contract Blogchain {
    
    address private owner;
    
    struct Post {
        string content;
        string title;
    }
    
    modifier isOwner {
        require(owner == msg.sender);
        _;
    }
    
    Post[] private posts;
    
    function Blogchain(address o) public {
        posts.push(Post("Caraibes", "plage et tout"));
        owner = o;
    }
    
    function addPost(string title, string content) public isOwner 
    returns(bool) 
    {    
        posts.push(Post(title, content));
        return true;
    }
    
    function getPost(uint index) public constant
    returns(string, string) 
    {
        Post memory post = posts[index];
        return (post.title, post.content);
    }
    
    function editPost(uint index, string title, string content) public isOwner
    returns(bool) 
    {
        posts[index] = Post(title, content);
        return true;
    }
    
    function removePost(uint index) public isOwner 
    returns(bool) 
    {   
        if (index >= posts.length) 
            return;

        for (uint i = index; i<posts.length-1; i++){
            posts[i] = posts[i+1];
        }
        delete posts[posts.length-1];
        posts.length--;
        return true;
    }
    
    function getNbPosts() public constant 
    returns (uint) 
    {
        return posts.length;
    }
    
}