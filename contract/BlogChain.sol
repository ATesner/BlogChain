pragma solidity ^0.4.13;

contract Blogchain {
    
    struct Post {
        string content;
        string title;
    }
    
    Post[] private posts;
    
    function Blogchain() public {
        addPost("Caraibes", "plage et tout");
    }
    
    function addPost(string title, string content) public 
    returns(bool) {
        
        posts.push(Post(title, content));
        return true;
    }
    
    function getPost(uint index) public constant
    returns(string, string) {
        
        Post memory post = posts[index];
        return (post.title, post.content);
    }
    
    function editPost(uint index, string title, string content) public
    returns(bool) {
        
        posts[index] = Post(title, content);
        return true;
    }
    
    function removePost(uint index) public returns(bool) {
        if (index >= posts.length) return;

        for (uint i = index; i<posts.length-1; i++){
            posts[i] = posts[i+1];
        }
        delete posts[posts.length-1];
        posts.length--;
        return true;
    }
    
    function getNbPosts() public constant returns (uint) {
        return posts.length;
    }
}