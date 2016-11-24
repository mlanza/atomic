grep -R "some" --exclude-dir="*node*" .

#PRINCIPLES
* Protocol functions should be payload first; all other functions payload last.
* Don't export protocol methods from types to ensure we deal with abstractions and not concrete types.
* The Law of Abstractions: Invoking a function against one concrete type can result in a different concrete type so long as the new type abides the same protocols.
* When possible replace macros with functions, otherwise omit.
