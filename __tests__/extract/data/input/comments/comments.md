# Комментарии {#comments}

## В разметке

[//]: Комментарий вне код блока.

`[//]: строчный комментарий игнорируется`

## В блоках кода

### Markdown

```markdown

[//]: Комментарий внутри код блока.

{% cut "Заголовок ката" %}

[//]: Комментарий внутри ката.

Контент, который отобразится по нажатию.

{% endcut %}
```

### HTML

```html
<!DOCTYPE html>
  <head>
    <title>Title</title>

    <style>body {width: 500px;}</style>

    <script type="application/javascript">
      // inline js comment
      function $init() {return true;}
      /*
       * multiline
       * js comment
      */
    </script>
  </head>
  <body>
    <!-- inline html comment -->
    <p checked class="title" id='title'>Title</p>
    <!--
        multiline
        html comment
    -->
  </body>
</html>
```

### Bash

```bash
#!/bin/bash

###### CONFIG
ACCEPTED_HOSTS="/root/.hag_accepted.conf"
BE_VERBOSE=false

if [ "$UID" -ne 0 ]
then
 echo "Superuser rights required"
 exit 2
fi

genApacheConf(){
 echo -e "# Host ${HOME_DIR}$1/$2 :"
}

echo '"quoted"' | tr -d \" > text.txt
```

### Cpp

```c++
#include <iostream>

int main(int argc, char *argv[]) {

  /* An annoying "Hello World" example */
  for (auto i = 0; i < 0xFFFF; i++)
    cout << "Hello, World!" << endl;

  char c = '\n';
  unordered_map <string, vector<string> > m;
  m["key"] = "\\\\"; // this is an error

  return -2e3 + 12l;
}
```

### Go

```go
package main

import "fmt"

func main() {
    ch := make(chan float64)
    ch <- 1.0e10    // magic number
    x, ok := <- ch
    defer fmt.Println(`exitting now\`)
    go println(len("hello world!"))
    return
}
```

### Java

```java
/**
 * multiline
 * java comment
*/
package l2f.gameserver.model;

public abstract strictfp class L2Char extends L2Object {
  public static final Short ERROR = 0x0001;

  public void moveTo(int x, int y, int z) {
    _ai = null;
    log("Should not be called");
    if (1 > 5) { // wtf!?
      return;
    }
  }
}
```

### Kotlin

```kotlin
import kotlinx.serialization.Serializable
import kotlin.random.Random

interface Building

/*
 * multiline
 * kotlin comment
*/
@Serializable
class House(
    private val rooms: Int? = 3,
    val name: String = "Palace"
) : Building {
    var residents: Int = 4
        get() {
            println("Current residents: $field")
            return field
        }

    fun burn(evacuation: (people: Int) -> Boolean) {
        rooms ?: return
        if (evacuation((0..residents).random()))
            residents = 0 // oh noo
    }
}

fun main() {
    val house = House(name = "Skyscraper 1")
    house.burn {
        Random.nextBoolean()
    }
}
```

### Objective C

```objectivec
#import <UIKit/UIKit.h>
#import "Dependency.h"

/* multiline
 * objective-c comment
*/

@protocol WorldDataSource
@optional
- (NSString*)worldName;
@required
- (BOOL)allowsToLive;
@end

@property (nonatomic, readonly) NSString *title;
- (IBAction) show; // inline objective-c comment
@end
```

### Python

```python
@requires_authorization(roles=["ADMIN"])
def somefunc(param1='', param2=0):
    if param1 > param2: # interesting
        print 'Gre\'ater'
    return (param2 - param1 + 1 + 0b10l) or None

class SomeClass:
    pass
```

### R

```r
require(stats)

# Compute different averages
#
# x vector of sample data
# type vector of length 1 specifying the average type
# returns the sample average according to the chosen method.

centre <- function(x, type) {
  switch(type,
         mean = mean(x),
         median = median(x),
         trimmed = mean(x, trim = .1))
}
x <- rcauchy(10)
centre(x, "mean")

library(ggplot2)

models <- tibble::tribble(
  ~model_name,    ~ formula,
  "length-width", Sepal.Length ~ Petal.Width + Petal.Length,
  "interaction",  Sepal.Length ~ Petal.Width * Petal.Length
)

iris %>%
  nest_by(Species) %>%
  left_join(models, by = character()) %>%
  rowwise(Species, model_name) %>%
  mutate(model = list(lm(formula, data = data))) %>%
  summarise(broom::glance(model))
```

### Swift

```swift
import Foundation

@objc class Person: Entity {
  var name: String!
  var age:  Int!

  init(name: String, age: Int) {
    /*
     * multiline
     * swift comment
    */
  }

  // Return a descriptive string for this person
  func description(offset: Int = 0) -> String {
    return "\(name) is \(age + offset) years old"
  }
}
```

### Typescript

```typescript
/*
 * multiline comment
*/
class MyClass {
  public static myValue: string;
  constructor(init: string) {
    this.myValue = init;
  }
}
import fs = require("fs");
module MyModule {
  export interface MyInterface extends Other {
    myProperty: any;
  }
}
declare magicNumber number;
myArray.forEach(() => { }); // fat arrow syntax
```

```hcl
resource "aws_instance" "example" {
  ami = "abc123"

  network_interface {
    # comment inside terraform language
  }
}
```
