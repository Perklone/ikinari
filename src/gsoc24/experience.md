---
"layout": "gsoclayout.html"
"title" : "Two-time the charm! Google Summer of Code 2024 for Scala Center"
"header": "Rizky Maulana GSoC24 story"
---

## Introduction
Who would have thought that I would be participating in Google Summer of Code again! I certainly didn’t, but here we are. It has been an amazing and difficult experience, and also really rewarding. I hope that this writing motivates anyone that wants to participate in this great program and learn from my experience. The project started from May, and ended on August (I chose the medium-sized project). If you want to learn more about the project itself, you can access it [here](https://miggy.moe/gsoc24) or click on the Home section.



It is important to note that I participated in this project without ever writing a single line of Scala code, by the time I got accepted to this program, I have tried playing around with the language, but I was nowhere near proficient with it, more-so with the ecosystem with it. The reason on why I chose this project, because at that time, I am really interested in working with command-line tool and something beyond CRUD work. As I searched through the list of project ideas from the organization lists, I stumbled across Scala Center page, and I found exactly what I wanted to do.

 ![Inquiry Email](../../img/gsoc24/email-1.png)


The first thing that I did before I create my proposal is to email my to-be mentor, [Jamie](https://www.linkedin.com/in/james-richard-thompson/). I asked him about what to expect in this project, how big is the scope of work going to be, and asked if I can try creating a proposal to work on this for this year GSoC. We then create a meeting to discuss the point that I brought up, and told me that I should go ahead and participate.

A week after the initial meeting which around early April, I was called for an interview to discuss regarding my experience, motivation and technical abilities for this project. The things that we discussed includes "How did I discover this project?", "How familiar are you with Scala and build tool domain?", and we talked about time commitment and other topic related to my timeline estimation for the project.

After the interview process, all I have to do is waiting if the good news will come. Fortunately, it did. on May 2nd, I received the informal email that I have been accepted to work on Scala Center.

## Preparation Period and Catching-up
I have very little experience with Scala by the time I got accepted, so most of my time during this phase is to familiarize myself with the language so by the time that the coding period started, I will be blocked less with my language knowledge. The tutorial that I used for getting up to speed is [RockTheJVM's Scala 3 course](https://rockthejvm.com/p/scala). It's quite expensive to buy the one-time purchase, so I bought a month subscription instead. Very worth it, but very hard aswell.

What did I learn in preparation for this project? Quite a lot actually. One concept that sticks to me from the start until or even going beyong the end of the program is the concept of **Functional Programming**. Scala, although based on JVM runtimes, same as Java, is very different from it's OOP-heavy sister language. I learned a lot about *Immutability*, *Function as Values*, and one that I liked most, [*Currying*](https://www.baeldung.com/scala/currying).

I also tried using Scala-CLI as my build tool, that means, creating a simple project using Scala that will be run with Scala-CLI. One project that I created is a clone of UNIX command for counting the size, word and lines of a file, `wc`.

```
import scala.io.Source
import scala.compiletime.ops.double
@main def CCWC(argument: String, file: String): Unit = {
  argument match
    case "-c" =>
      val fileSize = countByte(file)
      println(s"  $fileSize $file")
    case "-l" =>
      val fileLines = countLine(file)
      println(s"  $fileLines $file")
    case "-w" =>
      val fileWords = countWord(file)
      println(s"  $fileWords $file")
    case _ => println("Invalid Argument.")
}

def countByte(file: String): Integer = {
  Source
    .fromFile(file)
    .mkString
    .getBytes()
    .length
}

def countLine(file: String): Integer = {
  Source
    .fromFile(file)
    .getLines()
    .length
}

def countWord(file: String): Integer = {
  Source
    .fromFile(file)
    .mkString
    .trim
    .split("[\n ]")
    .length
}
```

and then you can run it in Scala-CLI:
```
scala-cli run wc.scala
```

or you can package it as an executable:
```
scala-cli --power package ccwc.scala
```

Scala-CLI is awesome for this kind of simple work, such a lovely tool <3.

So what did I do during my program at Scala Center? The first thing that I did is attend the meetup that the host created for [all contributors at Scala Center](https://www.linkedin.com/posts/scala-center_google-summer-of-code-activity-7213908994329821184-I1L6?utm_source=share&utm_medium=member_desktop), there were 10 contributors that are accepted to the program, working on various project that the Scala Center has, such as Scaladex, Scaladoc, and others.

After that it's all work on the project, we did alot of pair programming, we held weekly sync-up to discuss our progress and set checkpoint so we can measure how far we are from finishing the project.

## Learning from the Program
This program was not easy, in the middle of the program, there are multiple times that I felt like giving up due to the complexity of the project. Everything that I tried was not working, error was everywhere. This is Impostor Syndrome at its finest, and it happened often. I received this message after my midterm evaluation:

![Midterm Evaluation Feedback](../../img/gsoc24/experience-2.png)


This is everything that I need to push until the final evaluation. I'm really thankful that I have mentors that are really supportive and they kept helping me pushing through and finally finished the project. I learned a lot, and there are a few things that I wanted to share:

*1. Be Transparent regarding your progress*

It's important that you tried your best first before consulting others on what you are stuck on, but if you're at the point where nothing works, it's important to let them know sooner than later so you don't pigeonholed yourself and you can also get additional perspective on the thing you're stuck on. To make them easier to help you, this brings up to my next point:

*2. Logs are useful, make sure you create one*

When you are stuck on a problem, it's sometimes hard to explain on exactly what are you stuck with. A habit of mine that I cultivated when I'm stuck now is to trace back the flow for the things that I wanted to do, with what method did I attempt the issue with, and what exact problem are you having. Don't do the [XY Problem]("https://xyproblem.info/"). Explain the problem, not your attempted solution.

## Conclusion

This year Google Summer of Code is probably one of the hardest task that I have ever took ever since I touched programming. But that particular moment, where the project finally finished, and it ran properly for the first time, there's no feeling that could beat that. Make sure to check my technical documentation for this project in [technical docs](https://miggy.moe/gsoc24/technical) to know the inner working of what I did during this program.

Thank you for reading this everyone!