# CPSC 581 Project 2



## How to get started running the application: 

First you must make sure you have Node installed, you can check this with "node -v". If not, then you must download it

Next you must navigate to the project folder and run the command: "npm install". 

To then start the app, simply run the command: "npm start" within a terminal. This will give you a local host link. You can then open that link in two seperate browser tabs to act as a P2P connection. 




## Running the application accross different machines (Only one of us needs this)

In order to run the application accross two different machines you will first need to install cloudflared. 

    - macOs: brew install cloudflared

    - Windows: winget install Cloudflare.cloudflared
 
Next you just repeat the instructions from above by running "npm start" in one terminal. After you complete that, you then open a second terminal and run the command "cloudflared tunnel --url http://localhost:3000". This might take a second but it will then produce you with a website link (inside the commented box). Now anyone with the link can view the site as long as one computer is hosting it! 




