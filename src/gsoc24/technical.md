---
"layout": "gsoclayout.html"
"title" : "Concept Documentation for Supporting Source Generator inside Scala-CLI"
"header": "Source Generator - Scala-CLI"
---

## Introduction

This is the the documents of what goes through in the project in my Google Summer of Code program with Scala Center. Where I (hopefully can) explain how this project actually work inside Scala-CLI, and what are the initial concept that we have to the final design that We (Me and the mentors) ended up with. To read more about the non-technical aspect of my journey in GSoC, you can check it out [here](https://miggy.moe/gsoc24/experience).

## What is this project even about, anyway?

So what's a Source Generator? 

Source Generator is a tool that automatically create sources code on input data. Basically, it takes your data definitions file (eg: [.proto](https://protobuf.dev/getting-started/gotutorial/), [.smithy](https://smithy.io/2.0/ts-ssdk/handlers.html) files) and generate the code that complies with the data format protocol. It is **important** to note that the Scala-CLI itself doesn't do the actual running the generation process of the files. It is done through Scala-CLI build server, [Bloop](https://scalacenter.github.io/bloop/). Our goals is to **integrates** Source Generation into Scala-CLI, allowing users to submit input files which Scala-CLI passes to Bloop. It will then runs the appropriate generator, automatically producing new Scala files based on the input.

![Generation process flow](../../img/gsoc24/technical-1.png)
<br></br>

## Approach Discussion and First Prototype

The first part of the project is deciding how do want to approach the Source Generator feature. The options is between using the [command line option](https://scala-cli.virtuslab.org/docs/reference/cli-options) like this:

```
scala-cli run directory/project.scala --source-gen path/to/generator.scala
```

Or doing it via [Scala-CLI's Directive](https://scala-cli.virtuslab.org/docs/reference/directives) feature (example is from final design):

```
//> using SourceGenerator.scripts "path/to/generator.scala"
```

After we discussed in our sync-up meeting, we decided to take the directive approach for our first prototype. There are few reasons that we didn't pursue the command line options, this includes:
- A possibility for the command being too verbose to be put in a one-liner
- Implementation for the command line options can be complicated for the timeframe that we have
- Lack of familiarity with the language can hinders with the progress.

So what's the design of the first prototype looks like? We decided to take inspiration from Scala-CLI existing directives, [Publish](https://scala-cli.virtuslab.org/docs/reference/directives#publish). In particular we are really interested with how Publish directives implementation on the [Developer section](https://scala-cli.virtuslab.org/docs/reference/directives#publish).
```
//> using publish.developer "Perklone|Rizky Maulana|https://github.com/perklone"
```

So what components do we need to send our generator to Bloop? There's a few:
```
case class SourcesGlobs(
    directory: Path,
    walkDepth: Option[Int],
    includes: List[String],
    excludes: List[String]
)

case class SourceGenerator(
    sourcesGlobs: List[SourcesGlobs],
    outputDirectory: Path,
    command: List[String]
)
```

For the Source Generator to work, we need the glob (files that we will take from our directory), the output directory for the generated file, and what command do we want to run to this resource. The glob property consists of the Directory Path (our Input Directory), the Walk Depth which is how deep do we want to search the file, what files that we want to include, and if there are any files that we want to exclude.

Since the example from Bloop is using a Python file as it's generator, we decided to not strict it to only accepting Scala generator file just to see how the Source Generator will behave.

This is the concept that we came up with:

```
# ${.} is a scala-cli shorthand feature for path to the directory that contains this command

//> using sourceGenerator "${.}/source-generator-input|glob:test.in|python3 ${.}/source-generator-1.py"
```

Scala-CLI will fetch the value of this directive and store it as 
```
"${.}/source-generator-input|glob:test.in|python3 ${.}/source-generator-1.py"
``` 
Then we will parse it based on the separator `"|"` that we created to split the value. 

To store all of this splitted value, we created a new Config called `GeneratorConfig`. This Config then will be passed into list of options that [will be run when Scala-CLI is invoked](https://github.com/Perklone/scala-cli/blob/e2c50093ca068858ebdc04c7f916750f6c288949/modules/build/src/main/scala/scala/build/Project.scala#L90). The prototype of this feature is the milestone for my Midterm Evaluation.

## Second Iteration and a Much Cleaner Prototype

After I brought it up on the [issue discussion](https://github.com/VirtusLab/scala-cli/issues/610#issuecomment-2233147577), My mentor brought it up to the Scala-CLI team internally to discuss the viability of the concept. Few days later, we receive a design suggestion that will be the backbone of the second iteration.

The big changes in design is how the directive for the Source Generator is called. It goes from this one:
```
//> using sourceGenerator "${.}/source-generator-input|glob:test.in|python3 ${.}/source-generator-1.py"
```

Into directives that is stored in two different location, one inside the project file itself to give the location of the generator:
```
# project.scala
//> using sourceGenerator.scripts ${.}/generator/generator.scala
```

and another one inside the generator file itself to find the input directory and the file that we want to fetch:
```
# path/to/generator/generator.scala
//> using sourceGenerator.inputDirectory "${.}/../source-generator-input"
//> using sourceGenerator.glob "glob:test.in"
```

The hard thing about this design is that the directives in the generator cannot be fetched from the Scala-CLI invocation. We need to use the DirectivesProcessor ourselves to fetch the directive, separate the key from the values, and then handle cases like the special shorthand syntax like `${.}` ourselves.

Other changes that was suggested is to only support `.scala` generator files, hence we drop the value for the command processor. The processor will be [hardcoded inside the Build Options](https://github.com/Perklone/scala-cli/blob/main/modules/build/src/main/scala/scala/build/Project.scala#L69). 

## Conclusion

The example of the final prototype is shown here:

<video style="display: block;margin: auto;padding-bottom: 2rem;" width="480" height="320" controls>
  <source src="../../img/gsoc24/scala-cli-demo.mp4" type="video/mp4">
</video>

All that left that need to be done are creating is the final feature of using the same scala-cli path as the one we invoke the project file with, unit test, cleaning up some code to make it more easier to extend, and the code review from the team.

You can check the issue page [here](https://github.com/VirtusLab/scala-cli/issues/610) and Pull Request [here](https://github.com/VirtusLab/scala-cli/pull/3033). Thank you everyone that reads this article, and I hope it helped you to try working on Scala-CLI!