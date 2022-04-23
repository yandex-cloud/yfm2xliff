# %%%1%%% {#comments}

## %%%2%%%

[//]: %%%3%%%

`[//]: строчный комментарий игнорируется`

## %%%4%%%

### %%%5%%%

```markdown

[//]: %%%6%%%

{% cut "Заголовок ката" %}

[//]: %%%7%%%

Контент, который отобразится по нажатию.

{% endcut %}
```

### %%%8%%%

```html
<!DOCTYPE html>
  <head>
    <title>Title</title>

    <style>body {width: 500px;}</style>

    <script type="application/javascript">
      // %%%9%%%
      function $init() {return true;}
      /*
       * %%%10%%%
       * %%%11%%%
      */
    </script>
  </head>
  <body>
    <!-- %%%12%%% -->
    <p checked class="title" id='title'>Title</p>
    <!--
        %%%13%%%
        %%%14%%%
    -->
  </body>
</html>
```

### %%%15%%%

```bash
#!/bin/bash

###### %%%16%%%
ACCEPTED_HOSTS="/root/.hag_accepted.conf"
BE_VE%%%36%%%BOSE=false

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

### %%%17%%%

```c++
#include <iostream>

int main(int argc, char *argv[]) {

  /* %%%18%%% */
  for (auto i = 0; i < 0xFFFF; i++)
    cout << "Hello, World!" << endl;

  char c = '\n';
  unordered_map <string, vector<string> > m;
  m["key"] = "\\\\"; // %%%19%%%

  return -2e3 + 12l;
}
```

### %%%20%%%

```go
package main

import "fmt"

func main() {
    ch := make(chan float64)
    ch <- 1.0e10    // %%%21%%%
    x, ok := <- ch
    defer fmt.Println(`exitting now\`)
    go println(len("hello world!"))
    return
}
```

### %%%22%%%

```java
/**
 * %%%23%%%
 * %%%24%%%
*/
package l2f.gameserver.model;

public abstract strictfp class L2Char extends L2Object {
  public static final Short ERROR = 0x0001;

  public void moveTo(int x, int y, int z) {
    _ai = null;
    log("Should not be called");
    if (1 > 5) { // %%%25%%%!?
      return;
    }
  }
}
```

### %%%26%%%

```kotlin
import kotlinx.serialization.Serializable
import kotlin.random.Random

interface Building

/*
 * %%%27%%%
 * %%%28%%%
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
            residents = 0 // %%%29%%%
    }
}

fun main() {
    val house = House(name = "Skyscraper 1")
    house.burn {
        Random.nextBoolean()
    }
}
```

### %%%30%%%

```objectivec
#import <UIKit/UIKit.h>
#import "Dependency.h"

/* %%%31%%%
 * %%%32%%%
*/

@protocol WorldDataSource
@optional
- (NSString*)worldName;
@required
- (BOOL)allowsToLive;
@end

@property (nonatomic, readonly) NSString *title;
- (IBAction) show; // %%%33%%%
@end
```

### %%%34%%%

```python
@requires_authorization(roles=["ADMIN"])
def somefunc(param1='', param2=0):
    if param1 > param2: # %%%35%%%
        print 'Gre\'ater'
    return (param2 - param1 + 1 + 0b10l) or None

class SomeClass:
    pass
```

### R

```r
require(stats)

# %%%37%%%
#
# %%%38%%%
# %%%39%%%
# %%%40%%%.

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

### %%%41%%%

```swift
import Foundation

@objc class Person: Entity {
  var name: String!
  var age:  Int!

  init(name: String, age: Int) {
    /*
     * %%%42%%%
     * %%%43%%%
    */
  }

  // %%%44%%%
  func description(offset: Int = 0) -> String {
    return "\(name) is \(age + offset) years old"
  }
}
```

### %%%45%%%

```typescript
/*
 * %%%46%%%
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
myArray.forEach(() => { }); // %%%47%%%
```
