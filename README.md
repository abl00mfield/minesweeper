# Minesweeper

## Project #1 for the General Assembly Software Engineering Immersive - a web browser game using HTML, CSS, and Javascript.

For this project I created a game called Minesweeper. This game was always included with Microsoft Windows and was a game that my siblings and I often played as kids. The object of the game to to locate all of the hidden mines revealing all the squares that do not contain mines. If you happen to click on a mine, the game is over as all the bombs will explode. The board will tell you how many mines are surrounding a revealed square. Using logic and a little bit of luck is the way to win the game.

Uses JavaScript, HTML, and CSS.

Link -> https://abl00mfield.github.io/minesweeper/

The first page you will see upon clicking the link is some instructions and some options for the game.

!["opening screen"](assets/images/Screenshot%202025-02-27%20at%205.05.55 PM.png)

You can chose between 3 different board sizes and easy or hard mode. The easy mode ensures that the first cell you click on and all of the surrounding cells will not contain any mines.

!["blank game board"](assets/images/Screenshot%202025-02-27%20at%205.08.24 PM.png)

Once you have started the game you can start to "flag" by using a right click which cells you think contain mines. This will help you as you navigate the board and the counter at the top lets you know how many more mines you need to find. Once you clear all the squares that do not contain mines, you have won the game!

!["game in play"](assets/images/Screenshot%202025-02-27%20at%205.09.35 PM.png)

A couple of reasons why I chose to implement this game was that it is very nostalgic since I played it a lot growing up. Another reason that I chose to implement this game is that it uses recursion to clear the board when clicking on squares. Recursion is a really cool programming technique that has a function call itself to accomplish certain tasks. In recursion, you always need to have at least one base case where the function will return to the prior call. Even though recursion can sometimes be difficult to wrap your brain around, in many cases it is the most simple way to accomplish the task. In Minesweeper, I needed to clear the board starting from the cell that a user clicks on. The function works by first checking if the cell you are on is a mine, flagged, or outside the grid. These are the bases cases that the function will return from. Then it clears the square, and if it's blank, it goes through a loop of the coordinates that are all around the squaure and calls the function again on each of these coordinates. This is the best way to locate all the cells that are blank and therefore need to be revealed.

A few features that I decided to implement on the game was the ability for the user to select different board sizes and the easy/hard mode. To implement this, I needed to learn about using variables in CSS so that I could dynamically render the board to be different sizes. For the easy/hard mode I had to come up with a way to make sure that the cells surrounding the first click did not have any mines. I also learned how to implement a timer. I had fun adding audio as well - an explosion sound when a mine is hit and a fun victory tune when the user wins.

Some possible future enhancements are adding the ability for the user to choose how many mines they want to be hidden in the board, saving the user's progress, and creating a leaderboard with records to beat. I could also add a light/dark mode option.

This was a fun and interesting challenge that helped me further my JavaScript, HTML, and CSS skills.

Resources:<br>
[pink flag image](https://www.shareicon.net/flag-pink-mapmarker-66821) <br>
[explosion sound](https://pixabay.com/sound-effects/medium-explosion-40472/) <br>
[win sound](https://pixabay.com/sound-effects/marimba-win-e-3-209687/)
