# YOU'RE BANNED

This here is the code that powers the inscrutable website [https://youre.band](https://youre.band).  
Check it out if you love:
- jpeg compression artifacts
- things that are difficult to explain to your parents
- banning people

Basically, the site uses paperjs to render some shitty images, text, and form fields (emulated using basic shapes, an image of a cursor, and hidden html inputs) onto a hidden html canvas. That canvas is exported as a very low quality jpeg whenever the canvas changes, and the resultant shitty jpeg is then displayed in the browser.