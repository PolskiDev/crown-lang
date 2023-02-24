# Crown Programming Language

<center><img src="assets/crown-modern-icon.png" width="150px"></center>

### What it is?
Crown programming language compiler aims to simplify C programming language syntax and built-in features. Such as: string handling, vectors handling, file handling, parser, tokenization and compiler development. Normally we think C programming is hard and complex, this is actually truth. However with Crown programming language, the scenery has been changed, with a syntax near to Ruby, Javascript or Lua, even more people can program in C without programming in C. Using an intermediate C-transpiled language, that supports all C native functions and libraries, it means, you can program for Arduino, C Microcontrollers, desktop and even mobile computers.


Memory isn’t automatic disallocated or manipulated, Crown programming language runs directly on binary code, without a runtime or memory wasting due to a runtime or virtual machine. It’s syntax is easier than C, C++ or even Rust.

Some syntax elements are inherited from Pascal, Go, Ruby, Lua, Javascript and C. All low-level functionalities are inherited from C programming language.

It’s also a procedural, weak and static typed compiled programming language. Crown does not support classes or inheritance, due to it’s not an object-oriented programming language, like C++ (for instance).

Crown programming language compiles on pure ANSI-C, it means that all computers that has a Standard ANSI-C compiler can run Crown, independently of the operating system or processor architecture.


### How to build Crown from sources

First of all, install the dependencies: **Clang/LLVM, GCC, Node.js, NPM, GNU Make and Wget**.   

Debian/Ubuntu: `sudo apt install clang gcc nodejs npm make wget`


Unzip the downloaded folder and open inside it a terminal window.
Then, paste the following command: `sudo make all install`

To uninstall Crown, paste the following command: `sudo make remove`
  
  
**Gabriel Margarido**