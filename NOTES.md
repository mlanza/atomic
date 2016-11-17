grep -R "some" --exclude-dir="*node*" .

#PRINCIPLES
* Protocol functions should be payload first; all other functions payload last.
* Don't export protocol methods from types to ensure we deal with abstractions and not concrete types.
