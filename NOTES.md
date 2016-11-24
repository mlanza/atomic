grep -R "some" --exclude-dir="*node*" .

#PRINCIPLES
* Protocol functions should be payload first; all other functions payload last.
* Don't export protocol methods from types to ensure we deal with abstractions and not concrete types.
* When invoking a method against a concrete type a different concrete type may be returned (usually as a matter of efficiency)
* When possible replace macros with functions, otherwise omit
