---
"layout": "gsoclayout.html"
"title" : "Supporting Source Generator inside Scala-CLI"
---


<video style="display: block;margin: auto;padding-bottom: 2rem;" width="480" height="320" controls>
  <source src="../img/scala-cli-demo.mp4" type="video/mp4">
</video>

This is the master page of everything that I did for 2024 Google Summer of Code program, working for Scala Center. I worked on Scala-CLI, a command line tool to interact with the Scala Language. The motivation behind this project is to catch-up with Scala's other build tool, [sbt]("https://www.scala-sbt.org/"), and other popular build tool from other languages. The goals are to support code creation with generator in Scala-CLI. It is commonly used for generating code from data format file such as Protobuf and Smithy. With this you don’t have to manually create the code from your data format file.

I would like to give a massive shoutout to my mentors, [Kannupriya Kalra]("https://www.linkedin.com/in/kannupriyakalra/") and [Jamie Thompson](https://www.linkedin.com/in/james-richard-thompson/)  because without them, I definitely wouldn’t be able to complete this project. They have been the best in showing me the rope on working at Scala in the Scala-CLI codebase.

It is important to note that I participated in this project without ever writing a single line of Scala code, by the time I got accepted to this program, I have tried playing around with the language, but I was nowhere near proficient with it, more-so with the ecosystem with it. The reason on why I chose this project, because at that time, I am really interested in working with command-line tool and something beyond CRUD work. As I searched through the list of project ideas from the organization lists, I stumbled across Scala Center page, and I found exactly what I wanted to do.