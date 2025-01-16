# Class constructors

## Normal Classes

1. **Classic Constructor**

   ```csharp
      public class Person
      {
          public string Name { get; private set; }
          public int Age { get; private set; }

          public Person(string name, int age)
          {
              if (string.IsNullOrWhiteSpace(name))
                  throw new ArgumentException("Name cannot be empty", nameof(name));
              if (age < 0)
                  throw new ArgumentException("Age cannot be negative", nameof(age));

              Name = name;
              Age = age;
          }
      }

     // Creating and initializing an object
     Person person1 = new Person("John", 30);
   ```

2. Object Intializer 

    ```csharp
    public class Person
   {
       public string Name { get; set; }
       public int Age { get; set; }
   }

   // Creating and initializing an object
   Person person2 = new Person { Name = "Jane", Age = 25 };
    ```

3. Default Constructor and property setters

    ```csharp
    public class Person
   {
       public string Name { get; set; }
       public int Age { get; set; }
   }

   // Creating an object and setting properties
   Person person3 = new Person();
   person3.Name = "Alice";
   person3.Age = 28;

    ```

4. **Static method**

   ```csharp
   public class Person
   {
       public string Name { get; private set; }
       public int Age { get; private set; }

       private Person(string name, int age)
       {
           Name = name;
           Age = age;
       }

       public static Person Create(string name, int age)
       {
           if (string.IsNullOrWhiteSpace(name))
               throw new ArgumentException("Name cannot be empty", nameof(name));
           if (age < 0)
               throw new ArgumentException("Age cannot be negative", nameof(age));

           return new Person(name, age);
       }
   }

   // Creating and initializing an object
   Person person4 = Person.CreatePerson("Bob", 35);
   ```

## Records

```csharp
public record Person(string Name, int Age);


public record Person
{
    public string Name { get; init; }
    public int Age { get; init; }
}

public record Person(string Name, int Age)
{
    public static Person CreatePerson(string name, int age)
    {
        return new Person(name, age);
    }
}


```
